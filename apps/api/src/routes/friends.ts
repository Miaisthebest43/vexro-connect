import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';

const requestSchema = z.object({ username: z.string().trim() });

export async function friendRoutes(app: FastifyInstance) {
  // Send friend request
  app.post('/friends/request', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Username required' });

    const target = await query<{ id: string }>(`SELECT id FROM users WHERE username = $1`, [parsed.data.username]);
    if (!target.rowCount) return reply.code(404).send({ error: 'User not found' });
    const targetId = target.rows[0]!.id;

    if (targetId === user.id) return reply.code(400).send({ error: 'You cannot add yourself' });

    // Order IDs to prevent duplicate pairs
    const [u1, u2] = [user.id, targetId].sort();

    const existing = await query(`SELECT status FROM friendships WHERE user1_id = $1 AND user2_id = $2`, [u1, u2]);
    if (existing.rowCount) {
      const status = existing.rows[0]!.status;
      if (status === 'accepted') return reply.code(400).send({ error: 'Already friends' });
      if (status === 'pending') return reply.code(400).send({ error: 'Request already pending' });
    }

    await query(
      `INSERT INTO friendships (user1_id, user2_id, status, action_user_id) VALUES ($1, $2, 'pending', $3)`,
      [u1, u2, user.id]
    );
    return reply.send({ ok: true });
  });

  // Accept friend request
  app.post('/friends/accept', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Username required' });

    const target = await query<{ id: string }>(`SELECT id FROM users WHERE username = $1`, [parsed.data.username]);
    if (!target.rowCount) return reply.code(404).send({ error: 'User not found' });
    const targetId = target.rows[0]!.id;

    const [u1, u2] = [user.id, targetId].sort();

    const res = await query(
      `UPDATE friendships SET status = 'accepted' WHERE user1_id = $1 AND user2_id = $2 AND action_user_id <> $3 AND status = 'pending' RETURNING id`,
      [u1, u2, user.id]
    );
    if (!res.rowCount) return reply.code(400).send({ error: 'No pending request found' });
    return reply.send({ ok: true });
  });

  // List friends & pending requests
  app.get('/friends', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const r = await query(
      `SELECT f.status, f.action_user_id, u.id as user_id, u.username, u.avatar_url, u.status as presence
         FROM friendships f
         JOIN users u ON (u.id = CASE WHEN f.user1_id = $1 THEN f.user2_id ELSE f.user1_id END)
         WHERE f.user1_id = $1 OR f.user2_id = $1`,
      [user.id]
    );

    const friends = [];
    const incoming = [];
    const outgoing = [];

    for (const row of r.rows) {
      const isActionUser = row.action_user_id === user.id;
      const obj = { id: row.user_id, username: row.username, avatar_url: row.avatar_url, status: row.presence };
      if (row.status === 'accepted') friends.push(obj);
      else if (row.status === 'pending' && isActionUser) outgoing.push(obj);
      else if (row.status === 'pending' && !isActionUser) incoming.push(obj);
    }
    return reply.send({ friends, incoming, outgoing });
  });

  // Open DM channel
  app.post('/dms', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const parsed = z.object({ userId: z.string().uuid() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'userId required' });
    const targetId = parsed.data.userId;

    if (targetId === user.id) return reply.code(400).send({ error: 'Cannot DM yourself' });

    // Check friendship
    const [u1, u2] = [user.id, targetId].sort();
    const fs = await query(`SELECT 1 FROM friendships WHERE user1_id = $1 AND user2_id = $2 AND status = 'accepted'`, [u1, u2]);
    if (!fs.rowCount) return reply.code(403).send({ error: 'You must be friends to DM' });

    // Find existing DM channel
    const existing = await query(
      `SELECT id, name FROM channels WHERE type = 'dm' AND (
         (dm_user1_id = $1 AND dm_user2_id = $2) OR
         (dm_user1_id = $2 AND dm_user2_id = $1)
       )`,
      [user.id, targetId]
    );

    if (existing.rowCount) {
      return reply.send({ channel: existing.rows[0] });
    }

    // Create new DM channel
    const target = await query<{ username: string }>(`SELECT username FROM users WHERE id = $1`, [targetId]);
    const name = target.rows[0]?.username ?? 'DM';

    const newCh = await query(
      `INSERT INTO channels (type, dm_user1_id, dm_user2_id, name) VALUES ('dm', $1, $2, $3) RETURNING id, name`,
      [user.id, targetId, name]
    );
    return reply.send({ channel: newCh.rows[0] });
  });

  // List all DM channels
  app.get('/dms', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const r = await query(
      `SELECT c.id, c.name, u.avatar_url, u.status as presence, u.username
         FROM channels c
         JOIN users u ON u.id = CASE WHEN c.dm_user1_id = $1 THEN c.dm_user2_id ELSE c.dm_user1_id END
         WHERE c.type = 'dm' AND (c.dm_user1_id = $1 OR c.dm_user2_id = $1)
         ORDER BY c.created_at DESC`,
      [user.id]
    );
    return reply.send({ dms: r.rows });
  });
}
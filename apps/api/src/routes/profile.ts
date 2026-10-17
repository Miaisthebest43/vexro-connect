import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';
import { setUserStatus } from '../lib/presence.js';
import { getStatus } from '../lib/presence.js';

const updateSchema = z.object({
  bio: z.string().trim().max(200).optional(),
  status: z.enum(['online', 'idle', 'dnd', 'offline']).optional(),
});

export async function profileRoutes(app: FastifyInstance) {
  app.get('/users/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const r = await query<{ id: string; username: string; bio: string | null; avatar_url: string | null; created_at: Date }>(
      `SELECT id, username, bio, avatar_url, created_at FROM users WHERE id = $1`, [id]);
    const u = r.rows[0];
    if (!u) return reply.code(404).send({ error: 'User not found' });
    const stats = await query<{ messages: string; servers: string }>(
      `SELECT (SELECT COUNT(*)::text FROM messages WHERE author_id = $1) as messages,
              (SELECT COUNT(*)::text FROM server_members WHERE user_id = $1) as servers`, [id]);
    return reply.send({
      user: {
        id: u.id, username: u.username, bio: u.bio, avatar_url: u.avatar_url,
        created_at: u.created_at, status: getStatus(u.id),
        message_count: Number(stats.rows[0]?.messages ?? 0),
        server_count: Number(stats.rows[0]?.servers ?? 0),
      },
    });
  });

  app.patch('/me', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    const sets: string[] = []; const vals: any[] = []; let i = 1;
    if (parsed.data.bio !== undefined) { sets.push(`bio = $${i++}`); vals.push(parsed.data.bio); }
    if (parsed.data.status !== undefined) {
      sets.push(`status = $${i++}`); vals.push(parsed.data.status);
      await setUserStatus(user.id, parsed.data.status);
    }
    if (sets.length === 0) return reply.send({ ok: true });
    vals.push(user.id);
    await query(`UPDATE users SET ${sets.join(', ')} WHERE id = $${i}`, vals);
    return reply.send({ ok: true });
  });
}
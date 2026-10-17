import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';
import { getMemberRole, can } from '../lib/permissions.js';

const createServerSchema = z.object({ name: z.string().trim().min(2).max(64) });
const createChannelSchema = z.object({
  name: z.string().trim().min(1).max(32).regex(/^[a-z0-9-]+$/),
  category_id: z.string().uuid().optional(),
});
const updateServerSchema = z.object({
  name: z.string().trim().min(2).max(64).optional(),
  icon_url: z.string().max(500).optional(),
});
const createCategorySchema = z.object({ name: z.string().trim().min(1).max(64) });
const transferSchema = z.object({ new_owner_id: z.string().uuid() });

export async function serverRoutes(app: FastifyInstance) {
  app.post('/servers', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const parsed = createServerSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error', issues: parsed.error.issues });
    const user = req.user!;
    const s = await query(
      `INSERT INTO servers (name, owner_id) VALUES ($1, $2)
       RETURNING id, name, icon_url, owner_id, created_at`,
      [parsed.data.name, user.id]);
    const server = s.rows[0]!;
    await query(`INSERT INTO server_members (server_id, user_id, role) VALUES ($1, $2, 'owner')`,
      [server.id, user.id]);
    const c = await query(
      `INSERT INTO channels (server_id, name, position) VALUES ($1, 'general', 0)
       RETURNING id, name, category_id, position`, [server.id]);
    return reply.code(201).send({ server: { ...server, channels: [c.rows[0]] } });
  });

  app.get('/servers', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const r = await query(
      `SELECT s.id, s.name, s.icon_url, s.owner_id, s.created_at
         FROM servers s JOIN server_members sm ON sm.server_id = s.id
         WHERE sm.user_id = $1 ORDER BY s.created_at ASC`, [user.id]);
    return reply.send({ servers: r.rows });
  });

  app.get('/servers/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const s = await query(
      `SELECT s.id, s.name, s.icon_url, s.owner_id, s.created_at
         FROM servers s JOIN server_members sm ON sm.server_id = s.id
         WHERE s.id = $1 AND sm.user_id = $2`, [id, user.id]);
    if (!s.rowCount) return reply.code(404).send({ error: 'Server not found' });

    const ch = await query(
      `SELECT id, name, category_id, position FROM channels WHERE server_id = $1 ORDER BY position ASC, created_at ASC`, [id]);
    const cats = await query(
      `SELECT id, name, position FROM categories WHERE server_id = $1 ORDER BY position ASC`, [id]);

    // Unread counts per channel
    const unread = await query<{ channel_id: string; count: string }>(
      `SELECT m.channel_id, COUNT(*)::text as count
         FROM messages m
         LEFT JOIN channel_reads cr ON cr.channel_id = m.channel_id AND cr.user_id = $2
         WHERE m.channel_id IN (SELECT id FROM channels WHERE server_id = $1)
           AND (cr.last_read_at IS NULL OR m.created_at > cr.last_read_at)
           AND m.author_id <> $2
         GROUP BY m.channel_id`, [id, user.id]);
    const unreadMap: Record<string, number> = {};
    for (const row of unread.rows) unreadMap[row.channel_id] = Number(row.count);

    const myRole = await getMemberRole(id, user.id);

    return reply.send({
      server: { ...s.rows[0], channels: ch.rows, categories: cats.rows },
      unread: unreadMap,
      myRole,
    });
  });

  app.patch('/servers/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const role = await getMemberRole(id, user.id);
    if (!can(role, 'manage_server')) return reply.code(403).send({ error: 'Not allowed' });

    const parsed = updateServerSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });

    const sets: string[] = [];
    const vals: any[] = [];
    let i = 1;
    if (parsed.data.name) { sets.push(`name = $${i++}`); vals.push(parsed.data.name); }
    if (parsed.data.icon_url !== undefined) { sets.push(`icon_url = $${i++}`); vals.push(parsed.data.icon_url); }
    if (sets.length === 0) return reply.send({ ok: true });
    vals.push(id);
    const r = await query(`UPDATE servers SET ${sets.join(', ')} WHERE id = $${i} RETURNING id, name, icon_url, owner_id, created_at`, vals);
    const server = r.rows[0];
    await app.broadcastToServer(id, { type: 'server_updated', serverId: id, server });
    return reply.send({ server });
  });

  app.delete('/servers/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const role = await getMemberRole(id, user.id);
    if (role !== 'owner') return reply.code(403).send({ error: 'Only the owner can delete' });
    await query(`DELETE FROM servers WHERE id = $1`, [id]);
    return reply.send({ ok: true });
  });

  app.post('/servers/:id/transfer', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    if ((await getMemberRole(id, user.id)) !== 'owner') return reply.code(403).send({ error: 'Only the owner can transfer' });
    const parsed = transferSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    const target = await getMemberRole(id, parsed.data.new_owner_id);
    if (!target) return reply.code(400).send({ error: 'Target is not a member' });
    await query(`UPDATE servers SET owner_id = $1 WHERE id = $2`, [parsed.data.new_owner_id, id]);
    await query(`UPDATE server_members SET role = 'owner' WHERE server_id = $1 AND user_id = $2`,
      [id, parsed.data.new_owner_id]);
    await query(`UPDATE server_members SET role = 'admin' WHERE server_id = $1 AND user_id = $2`,
      [id, user.id]);
    return reply.send({ ok: true });
  });

  app.post('/servers/:id/channels', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const role = await getMemberRole(serverId, user.id);
    if (!can(role, 'manage_channels')) return reply.code(403).send({ error: 'Not allowed' });
    const parsed = createChannelSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error', issues: parsed.error.issues });
    try {
      const r = await query(
        `INSERT INTO channels (server_id, name, category_id, position)
         VALUES ($1, $2, $3, COALESCE((SELECT MAX(position)+1 FROM channels WHERE server_id=$1), 0))
         RETURNING id, name, category_id, position`,
        [serverId, parsed.data.name, parsed.data.category_id ?? null]);
      const channel = r.rows[0];
      await app.broadcastToServer(serverId, { type: 'channel_created', serverId, channel });
      return reply.code(201).send({ channel });
    } catch (e: any) {
      if (e.code === '23505') return reply.code(409).send({ error: 'Channel name already taken' });
      throw e;
    }
  });

  app.delete('/channels/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const cr = await query<{ server_id: string }>(`SELECT server_id FROM channels WHERE id = $1`, [id]);
    if (!cr.rowCount) return reply.code(404).send({ error: 'Channel not found' });
    const serverId = cr.rows[0]!.server_id;
    const role = await getMemberRole(serverId, user.id);
    if (!can(role, 'manage_channels')) return reply.code(403).send({ error: 'Not allowed' });
    await query(`DELETE FROM channels WHERE id = $1`, [id]);
    await app.broadcastToServer(serverId, { type: 'channel_deleted', serverId, channelId: id });
    return reply.send({ ok: true });
  });

  // Categories
  app.post('/servers/:id/categories', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const role = await getMemberRole(serverId, user.id);
    if (!can(role, 'manage_channels')) return reply.code(403).send({ error: 'Not allowed' });
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    const r = await query(
      `INSERT INTO categories (server_id, name, position)
       VALUES ($1, $2, COALESCE((SELECT MAX(position)+1 FROM categories WHERE server_id=$1), 0))
       RETURNING id, name, position`, [serverId, parsed.data.name]);
    return reply.code(201).send({ category: r.rows[0] });
  });

  app.delete('/categories/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const cr = await query<{ server_id: string }>(`SELECT server_id FROM categories WHERE id = $1`, [id]);
    if (!cr.rowCount) return reply.code(404).send({ error: 'Not found' });
    const role = await getMemberRole(cr.rows[0]!.server_id, user.id);
    if (!can(role, 'manage_channels')) return reply.code(403).send({ error: 'Not allowed' });
    await query(`DELETE FROM categories WHERE id = $1`, [id]);
    return reply.send({ ok: true });
  });

  // Members with roles + nicknames
  app.get('/servers/:id/members', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const role = await getMemberRole(serverId, user.id);
    if (!role) return reply.code(403).send({ error: 'Not a member' });
    const r = await query(
      `SELECT u.id, u.username, u.avatar_url, u.status, u.bio,
              sm.role, sm.nickname, sm.joined_at
         FROM server_members sm JOIN users u ON u.id = sm.user_id
         WHERE sm.server_id = $1
         ORDER BY CASE sm.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END, u.username ASC`,
      [serverId]);
    return reply.send({ members: r.rows });
  });

  app.patch('/servers/:id/members/:userId', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId, userId } = req.params as { id: string; userId: string };
    const myRole = await getMemberRole(serverId, user.id);
    const updateSchema = z.object({
      nickname: z.string().trim().max(32).nullable().optional(),
      role: z.enum(['admin', 'member']).optional(),
    });
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });

    const isMe = userId === user.id;
    const canManageRole = can(myRole, 'manage_server');
    const canSetOwnNick = isMe;

    if (parsed.data.role !== undefined && !canManageRole) {
      return reply.code(403).send({ error: 'Not allowed to change roles' });
    }
    if (parsed.data.nickname !== undefined && !isMe && !canManageRole) {
      return reply.code(403).send({ error: 'Not allowed to change nickname' });
    }

    const sets: string[] = [];
    const vals: any[] = [];
    let i = 1;
    if (parsed.data.nickname !== undefined) { sets.push(`nickname = $${i++}`); vals.push(parsed.data.nickname); }
    if (parsed.data.role !== undefined) { sets.push(`role = $${i++}`); vals.push(parsed.data.role); }
    if (sets.length === 0) return reply.send({ ok: true });
    vals.push(serverId, userId);
    await query(`UPDATE server_members SET ${sets.join(', ')} WHERE server_id = $${i} AND user_id = $${i + 1}`, vals);
    await app.broadcastToServer(serverId, { type: 'member_updated', serverId, userId });
    return reply.send({ ok: true });
  });

  app.delete('/servers/:id/members/:userId', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId, userId } = req.params as { id: string; userId: string };
    const myRole = await getMemberRole(serverId, user.id);
    if (!can(myRole, 'kick')) return reply.code(403).send({ error: 'Not allowed' });
    if (userId === user.id) return reply.code(400).send({ error: "Can't kick yourself" });
    const targetRole = await getMemberRole(serverId, userId);
    if (targetRole === 'owner') return reply.code(400).send({ error: "Can't kick the owner" });
    if (myRole === 'admin' && targetRole === 'admin') return reply.code(403).send({ error: 'Admins cannot kick admins' });
    await query(`DELETE FROM server_members WHERE server_id = $1 AND user_id = $2`, [serverId, userId]);
    await app.broadcastToServer(serverId, { type: 'member_removed', serverId, userId });
    return reply.send({ ok: true });
  });

  // Bans
  app.post('/servers/:id/bans', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const myRole = await getMemberRole(serverId, user.id);
    if (!can(myRole, 'ban')) return reply.code(403).send({ error: 'Not allowed' });
    const parsed = z.object({ user_id: z.string().uuid(), reason: z.string().max(500).optional() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    const targetRole = await getMemberRole(serverId, parsed.data.user_id);
    if (targetRole === 'owner') return reply.code(400).send({ error: "Can't ban the owner" });
    await query(
      `INSERT INTO bans (server_id, user_id, banned_by, reason) VALUES ($1, $2, $3, $4)
       ON CONFLICT (server_id, user_id) DO UPDATE SET reason = EXCLUDED.reason`,
      [serverId, parsed.data.user_id, user.id, parsed.data.reason ?? null]);
    await query(`DELETE FROM server_members WHERE server_id = $1 AND user_id = $2`, [serverId, parsed.data.user_id]);
    await app.broadcastToServer(serverId, { type: 'member_banned', serverId, userId: parsed.data.user_id });
    return reply.send({ ok: true });
  });

  app.delete('/servers/:id/bans/:userId', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId, userId } = req.params as { id: string; userId: string };
    const myRole = await getMemberRole(serverId, user.id);
    if (!can(myRole, 'ban')) return reply.code(403).send({ error: 'Not allowed' });
    await query(`DELETE FROM bans WHERE server_id = $1 AND user_id = $2`, [serverId, userId]);
    return reply.send({ ok: true });
  });

  app.get('/servers/:id/bans', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const myRole = await getMemberRole(serverId, user.id);
    if (!can(myRole, 'ban')) return reply.code(403).send({ error: 'Not allowed' });
    const r = await query(
      `SELECT b.user_id, u.username, b.reason, b.created_at
         FROM bans b JOIN users u ON u.id = b.user_id
         WHERE b.server_id = $1 ORDER BY b.created_at DESC`, [serverId]);
    return reply.send({ bans: r.rows });
  });
}

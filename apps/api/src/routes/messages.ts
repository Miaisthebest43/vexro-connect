import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';
import { notifyChannelMembers } from '../lib/push.js';

const sendSchema = z.object({
  content: z.string().trim().max(4000).default(''),
  attachment_url: z.string().max(500).optional(),
  attachment_type: z.enum(['image', 'file']).optional(),
  attachment_width: z.number().int().positive().optional(),
  attachment_height: z.number().int().positive().optional(),
  reply_to_id: z.string().uuid().optional(),
}).refine((v) => v.content.length > 0 || v.attachment_url, { message: 'Message must have content or attachment' });

const editSchema = z.object({ content: z.string().trim().min(1).max(4000) });
const reactionSchema = z.object({ emoji: z.string().trim().min(1).max(16) });

const MSG_COLS = `
  m.id, m.content, m.created_at, m.edited_at, m.author_id,
  m.attachment_url, m.attachment_type, m.attachment_width, m.attachment_height,
  m.reply_to_id, m.pinned,
  u.username, u.avatar_url,
  COALESCE(sm.nickname, u.username) as display_name,
  (SELECT json_build_object('id', r.id, 'content', r.content, 'username', ru.username)
     FROM messages r JOIN users ru ON ru.id = r.author_id
     WHERE r.id = m.reply_to_id) as reply_to
`;

async function attachReactions(rows: any[]): Promise<any[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const rx = await query<any>(
    `SELECT r.message_id, r.emoji, u.username FROM reactions r JOIN users u ON u.id = r.user_id
       WHERE r.message_id = ANY($1::uuid[])`, [ids]);
  const byMsg = new Map<string, Map<string, string[]>>();
  for (const row of rx.rows) {
    if (!byMsg.has(row.message_id)) byMsg.set(row.message_id, new Map());
    const m = byMsg.get(row.message_id)!;
    if (!m.has(row.emoji)) m.set(row.emoji, []);
    m.get(row.emoji)!.push(row.username);
  }
  return rows.map((r) => ({
    ...r,
    reactions: Array.from((byMsg.get(r.id) ?? new Map()).entries()).map(([emoji, users]) => ({ emoji, count: users.length, users })),
  }));
}

async function checkChannelAccess(
  channelId: string,
  userId: string
): Promise<{ server_id: string | null; type: string } | null> {
  const r = await query<{ server_id: string | null; type: string; dm_user1_id: string | null; dm_user2_id: string | null }>(
    `SELECT server_id, type, dm_user1_id, dm_user2_id FROM channels WHERE id = $1`,
    [channelId]
  );
  const ch = r.rows[0];
  if (!ch) return null;
  if (ch.type === 'dm') {
    if (ch.dm_user1_id !== userId && ch.dm_user2_id !== userId) return null;
    return { server_id: null, type: 'dm' };
  }
  const m = await query(`SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`, [ch.server_id, userId]);
  if (!m.rowCount) return null;
  return { server_id: ch.server_id, type: 'server' };
}

export async function messageRoutes(app: FastifyInstance) {
  // ---- Search across server ----
  app.get('/servers/:id/search', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const q = String((req.query as any).q ?? '').trim();
    if (q.length < 2) return reply.send({ results: [] });
    const role = await query(`SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`, [serverId, user.id]);
    if (!role.rowCount) return reply.code(403).send({ error: 'Not a member' });

    const r = await query(
      `SELECT m.id, m.content, m.created_at, m.channel_id, c.name as channel_name, u.username
         FROM messages m
         JOIN channels c ON c.id = m.channel_id
         JOIN users u ON u.id = m.author_id
         WHERE c.server_id = $1 AND m.content ILIKE $2
         ORDER BY m.created_at DESC LIMIT 40`,
      [serverId, `%${q}%`]);
    return reply.send({ results: r.rows });
  });

  // ---- Pinned list ----
  app.get('/channels/:id/pins', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: channelId } = req.params as { id: string };
    const access = await checkChannelAccess(channelId, user.id);
    if (!access) return reply.code(403).send({ error: 'No access' });
    const r = await query(
      `SELECT m.id, m.content, m.created_at, u.username
         FROM messages m JOIN users u ON u.id = m.author_id
         WHERE m.channel_id = $1 AND m.pinned = true
         ORDER BY m.created_at DESC`, [channelId]);
    return reply.send({ pins: r.rows });
  });

  // ---- List messages ----
  app.get('/channels/:id/messages', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: channelId } = req.params as { id: string };
    const limit = Math.min(Number((req.query as any).limit ?? 50), 100);

    const access = await checkChannelAccess(channelId, user.id);
    if (!access) return reply.code(403).send({ error: 'No access' });

    const r = await query(
      `SELECT ${MSG_COLS}
         FROM messages m
         JOIN users u ON u.id = m.author_id
         LEFT JOIN server_members sm ON sm.server_id = $3 AND sm.user_id = u.id
         WHERE m.channel_id = $1
         ORDER BY m.created_at DESC LIMIT $2`,
      [channelId, limit, access.server_id]);
    const withRx = await attachReactions(r.rows.reverse());
    return reply.send({ messages: withRx });
  });

  // ---- Send message ----
  app.post('/channels/:id/messages', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: channelId } = req.params as { id: string };

    const access = await checkChannelAccess(channelId, user.id);
    if (!access) return reply.code(403).send({ error: 'No access' });

    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error', issues: parsed.error.issues });

    const chInfo = await query<{ channel_name: string; server_name: string | null }>(
      `SELECT c.name as channel_name, s.name as server_name
         FROM channels c LEFT JOIN servers s ON s.id = c.server_id
         WHERE c.id = $1`, [channelId]);
    const { channel_name, server_name } = chInfo.rows[0]!;

    const r = await query(
      `WITH ins AS (
         INSERT INTO messages (channel_id, author_id, content, attachment_url, attachment_type,
                               attachment_width, attachment_height, reply_to_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *
       )
       SELECT ${MSG_COLS}
         FROM ins m
         JOIN users u ON u.id = m.author_id
         LEFT JOIN server_members sm ON sm.server_id = $9 AND sm.user_id = u.id`,
      [channelId, user.id, parsed.data.content, parsed.data.attachment_url ?? null,
       parsed.data.attachment_type ?? null, parsed.data.attachment_width ?? null,
       parsed.data.attachment_height ?? null, parsed.data.reply_to_id ?? null, access.server_id]);

    const message = { ...r.rows[0]!, reactions: [] };
    app.broadcastToChannel(channelId, { type: 'message', channelId, message });

    const preview = parsed.data.content
      ? parsed.data.content.slice(0, 120)
      : (parsed.data.attachment_type === 'image' ? 'Image' : 'File');
    notifyChannelMembers(channelId, user.id, {
      title: server_name ? `#${channel_name} - ${server_name}` : `@${channel_name}`,
      body: `${user.username}: ${preview}`,
      data: { channelId },
    }).catch((e) => app.log.error(e));

    return reply.code(201).send({ message });
  });

  // ---- Edit ----
  app.patch('/messages/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const parsed = editSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    const r = await query<{ author_id: string; channel_id: string }>(`SELECT author_id, channel_id FROM messages WHERE id = $1`, [id]);
    const msg = r.rows[0];
    if (!msg) return reply.code(404).send({ error: 'Not found' });
    if (msg.author_id !== user.id) return reply.code(403).send({ error: 'Not your message' });
    const u = await query(`UPDATE messages SET content = $1, edited_at = now() WHERE id = $2 RETURNING edited_at`, [parsed.data.content, id]);
    app.broadcastToChannel(msg.channel_id, {
      type: 'message_edited', channelId: msg.channel_id, messageId: id,
      content: parsed.data.content, edited_at: u.rows[0]!.edited_at,
    });
    return reply.send({ ok: true });
  });

  // ---- Delete ----
  app.delete('/messages/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const r = await query<{ author_id: string; channel_id: string; owner_id: string | null }>(
      `SELECT m.author_id, m.channel_id, s.owner_id
         FROM messages m
         JOIN channels c ON c.id = m.channel_id
         LEFT JOIN servers s ON s.id = c.server_id
         WHERE m.id = $1`, [id]);
    const msg = r.rows[0];
    if (!msg) return reply.code(404).send({ error: 'Not found' });
    if (msg.author_id !== user.id && msg.owner_id !== user.id) return reply.code(403).send({ error: 'Not allowed' });
    await query(`DELETE FROM messages WHERE id = $1`, [id]);
    app.broadcastToChannel(msg.channel_id, { type: 'message_deleted', channelId: msg.channel_id, messageId: id });
    return reply.send({ ok: true });
  });

  // ---- Pin / unpin ----
  app.post('/messages/:id/pin', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id } = req.params as { id: string };
    const r = await query<{ channel_id: string; pinned: boolean }>(
      `SELECT channel_id, pinned FROM messages WHERE id = $1`, [id]);
    const msg = r.rows[0];
    if (!msg) return reply.code(404).send({ error: 'Not found' });
    const access = await checkChannelAccess(msg.channel_id, user.id);
    if (!access) return reply.code(403).send({ error: 'Not allowed' });
    const newPinned = !msg.pinned;
    await query(`UPDATE messages SET pinned = $1 WHERE id = $2`, [newPinned, id]);
    app.broadcastToChannel(msg.channel_id, { type: 'message_pinned', channelId: msg.channel_id, messageId: id, pinned: newPinned });
    return reply.send({ ok: true, pinned: newPinned });
  });

  // ---- Reactions ----
  app.post('/messages/:id/reactions', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: messageId } = req.params as { id: string };
    const parsed = reactionSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    const r = await query<{ channel_id: string }>(`SELECT channel_id FROM messages WHERE id = $1`, [messageId]);
    const msg = r.rows[0];
    if (!msg) return reply.code(404).send({ error: 'Not found' });
    const access = await checkChannelAccess(msg.channel_id, user.id);
    if (!access) return reply.code(403).send({ error: 'No access' });

    const existing = await query(
      `SELECT 1 FROM reactions WHERE message_id = $1 AND user_id = $2 AND emoji = $3`,
      [messageId, user.id, parsed.data.emoji]
    );
    let action: 'added' | 'removed';
    if (existing.rowCount) {
      await query(`DELETE FROM reactions WHERE message_id = $1 AND user_id = $2 AND emoji = $3`, [messageId, user.id, parsed.data.emoji]);
      action = 'removed';
    } else {
      await query(`INSERT INTO reactions (message_id, user_id, emoji) VALUES ($1, $2, $3)`, [messageId, user.id, parsed.data.emoji]);
      action = 'added';
    }

    const rx = await query<{ emoji: string; username: string }>(
      `SELECT r.emoji, u.username FROM reactions r JOIN users u ON u.id = r.user_id WHERE r.message_id = $1`, [messageId]);
    const grouped = new Map<string, string[]>();
    for (const row of rx.rows) {
      if (!grouped.has(row.emoji)) grouped.set(row.emoji, []);
      grouped.get(row.emoji)!.push(row.username);
    }
    const reactions = Array.from(grouped.entries()).map(([emoji, users]) => ({ emoji, count: users.length, users }));
    app.broadcastToChannel(msg.channel_id, { type: 'reaction_updated', channelId: msg.channel_id, messageId, reactions });
    return reply.send({ ok: true, action, reactions });
  });

  // ---- Mark read (single source of truth) ----
  app.post('/channels/:id/read', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: channelId } = req.params as { id: string };
    const access = await checkChannelAccess(channelId, user.id);
    if (!access) return reply.code(403).send({ error: 'No access' });
    await query(
      `INSERT INTO channel_reads (user_id, channel_id, last_read_at) VALUES ($1, $2, now())
       ON CONFLICT (user_id, channel_id) DO UPDATE SET last_read_at = now()`,
      [user.id, channelId]);
    return reply.send({ ok: true });
  });
}
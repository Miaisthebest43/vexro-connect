import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';
import { notifyChannelMembers } from '../lib/push.js';

const sendSchema = z.object({
  content: z.string().trim().max(4000).default(''),
  attachment_url: z.string().max(500).optional(),
  attachment_type: z.enum(['image', 'file']).optional(),
  reply_to_id: z.string().uuid().optional(),
  parent_message_id: z.string().uuid().optional(),
}).refine(v => v.content.length > 0 || v.attachment_url, { message: 'Must have content or attachment' });

async function checkAccess(channelId: string, userId: string) {
  const r = await query<{ server_id: string | null; type: string; dm_user1_id: string | null; dm_user2_id: string | null }>(
    `SELECT server_id, type, dm_user1_id, dm_user2_id FROM channels WHERE id = $1`, [channelId]);
  const ch = r.rows[0];
  if (!ch) return null;
  if (ch.type === 'dm') {
    if (ch.dm_user1_id !== userId && ch.dm_user2_id !== userId) {
      const p = await query(`SELECT 1 FROM dm_participants WHERE channel_id = $1 AND user_id = $2`, [channelId, userId]);
      if (!p.rowCount) return null;
    }
    return ch;
  }
  const m = await query(`SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`, [ch.server_id, userId]);
  return m.rowCount ? ch : null;
}

export async function messageRoutes(app: FastifyInstance) {
  app.get('/channels/:id/messages', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: channelId } = req.params as any;
    const parentId = (req.query as any).parent_id;

    const ch = await checkAccess(channelId, user.id);
    if (!ch) return reply.code(403).send({ error: 'No access' });

    let whereClause = `m.channel_id = $1 AND m.parent_message_id IS NULL`;
    let params: any[] = [channelId];

    if (parentId) {
      whereClause = `m.channel_id = $1 AND m.parent_message_id = $2`;
      params.push(parentId);
    }

    const r = await query(
      `SELECT m.id, m.content, m.created_at, m.edited_at, m.author_id, m.attachment_url, m.attachment_type,
              m.reply_to_id, m.parent_message_id, m.pinned, u.username, u.avatar_url,
              (SELECT COUNT(*) FROM messages WHERE parent_message_id = m.id) as thread_count
         FROM messages m JOIN users u ON u.id = m.author_id
         WHERE ${whereClause}
         ORDER BY m.created_at ASC LIMIT 50`, params);

    return reply.send({ messages: r.rows });
  });

  app.post('/channels/:id/messages', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: channelId } = req.params as any;
    const ch = await checkAccess(channelId, user.id);
    if (!ch) return reply.code(403).send({ error: 'No access' });

    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation' });

    const r = await query(
      `INSERT INTO messages (channel_id, author_id, content, attachment_url, attachment_type, reply_to_id, parent_message_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [channelId, user.id, parsed.data.content, parsed.data.attachment_url, parsed.data.attachment_type, parsed.data.reply_to_id, parsed.data.parent_message_id]);
    const message = { ...r.rows[0], username: user.username };

    app.broadcastToChannel(channelId, { type: 'message', channelId, message });
    return reply.code(201).send({ message });
  });

  // Read Receipts
  app.post('/channels/:id/read', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    await query(
      `INSERT INTO message_reads (user_id, channel_id, last_read_at) VALUES ($1, $2, now())
       ON CONFLICT (user_id, channel_id) DO UPDATE SET last_read_at = now()`, [user.id, (req.params as any).id]);
    return reply.send({ ok: true });
  });

  app.get('/channels/:id/reads', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const r = await query(
      `SELECT u.username, mr.last_read_at FROM message_reads mr JOIN users u ON u.id = mr.user_id WHERE mr.channel_id = $1`,
      [(req.params as any).id]);
    return reply.send({ reads: r.rows });
  });
}
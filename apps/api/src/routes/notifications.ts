import type { FastifyInstance } from 'fastify';
import { query } from '../lib/db.js';

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/notifications', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const r = await query(
      `SELECT id, type, title, body, link, read, created_at
         FROM notifications WHERE user_id = $1
         ORDER BY created_at DESC LIMIT 50`, [user.id]);
    const unread = await query<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM notifications WHERE user_id = $1 AND read = false`, [user.id]);
    return reply.send({ notifications: r.rows, unread: Number(unread.rows[0]?.count ?? 0) });
  });

  app.patch('/notifications/:id/read', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    await query(`UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2`, [(req.params as any).id, user.id]);
    return reply.send({ ok: true });
  });

  app.post('/notifications/read-all', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    await query(`UPDATE notifications SET read = true WHERE user_id = $1 AND read = false`, [user.id]);
    return reply.send({ ok: true });
  });
}
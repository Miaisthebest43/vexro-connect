import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';

const reportSchema = z.object({
  target_type: z.enum(['user', 'message', 'server']),
  target_id: z.string().uuid(),
  reason: z.string().min(3).max(200),
  details: z.string().max(2000).optional(),
});

export async function safetyRoutes(app: FastifyInstance) {
  app.post('/reports', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    await query(
      `INSERT INTO reports (reporter_id, target_type, target_id, reason, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, parsed.data.target_type, parsed.data.target_id, parsed.data.reason, parsed.data.details ?? null]);
    return reply.send({ ok: true });
  });

  app.get('/blocks', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const r = await query(
      `SELECT b.blocked_id, u.username, u.avatar_url, b.created_at
         FROM blocked_users b JOIN users u ON u.id = b.blocked_id
         WHERE b.blocker_id = $1 ORDER BY b.created_at DESC`, [user.id]);
    return reply.send({ blocks: r.rows });
  });

  app.post('/blocks', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const parsed = z.object({ user_id: z.string().uuid() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    if (parsed.data.user_id === user.id) return reply.code(400).send({ error: 'Cannot block yourself' });
    await query(
      `INSERT INTO blocked_users (blocker_id, blocked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user.id, parsed.data.user_id]);
    return reply.send({ ok: true });
  });

  app.delete('/blocks/:userId', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    await query(
      `DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`,
      [user.id, (req.params as any).userId]);
    return reply.send({ ok: true });
  });
}
import type { FastifyInstance } from 'fastify';
import { query } from '../lib/db.js';

export async function sessionRoutes(app: FastifyInstance) {
  app.get('/sessions', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const r = await query(
      `SELECT id, device_name, last_active, created_at FROM sessions WHERE user_id = $1 AND expires_at > now() ORDER BY last_active DESC`,
      [user.id]
    );
    return reply.send({ sessions: r.rows });
  });

  app.delete('/sessions/:id', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    await query(`DELETE FROM sessions WHERE id = $1 AND user_id = $2`, [(req.params as any).id, user.id]);
    return reply.send({ ok: true });
  });
}
import type { FastifyInstance } from 'fastify';
import { query } from '../lib/db.js';

export async function searchRoutes(app: FastifyInstance) {
  app.get('/channels/:id/search', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const q = (req.query as any).q;
    if (!q) return reply.send({ messages: [] });
    const r = await query(`SELECT m.*, u.username FROM messages m JOIN users u ON u.id = m.author_id WHERE m.channel_id = $1 AND m.content ILIKE $2 LIMIT 20`, [(req.params as any).id, `%${q}%`]);
    return reply.send({ messages: r.rows });
  });
}
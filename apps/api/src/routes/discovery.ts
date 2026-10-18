import type { FastifyInstance } from 'fastify';
import { query } from '../lib/db.js';

export async function discoveryRoutes(app: FastifyInstance) {
  app.get('/discover', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const r = await query(
      `SELECT s.id, s.name, s.icon_url, COUNT(sm.user_id) as members
         FROM servers s LEFT JOIN server_members sm ON sm.server_id = s.id
         WHERE s.is_public = true GROUP BY s.id LIMIT 20`);
    return reply.send({ servers: r.rows });
  });
}
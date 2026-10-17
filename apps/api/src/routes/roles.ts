import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';

export async function roleRoutes(app: FastifyInstance) {
  app.get('/servers/:id/roles', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const r = await query(`SELECT * FROM roles WHERE server_id = $1`, [(req.params as any).id]);
    return reply.send({ roles: r.rows });
  });

  app.post('/servers/:id/roles', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const parsed = z.object({ name: z.string(), color: z.string() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid' });
    const r = await query(`INSERT INTO roles (server_id, name, color) VALUES ($1, $2, $3) RETURNING *`, [(req.params as any).id, parsed.data.name, parsed.data.color]);
    return reply.send({ role: r.rows[0] });
  });
}
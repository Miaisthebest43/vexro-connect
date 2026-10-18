import type { FastifyInstance } from 'fastify';
import { query } from '../lib/db.js';
import { getMemberRole, can } from '../lib/permissions.js';

export async function auditRoutes(app: FastifyInstance) {
  app.get('/servers/:id/audit', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const role = await getMemberRole(serverId, user.id);
    if (!can(role, 'manage_server')) return reply.code(403).send({ error: 'Not allowed' });
    const r = await query(
      `SELECT a.id, a.action, a.target_type, a.target_id, a.details, a.created_at,
              u.username as actor_username
         FROM audit_log a JOIN users u ON u.id = a.actor_id
         WHERE a.server_id = $1 ORDER BY a.created_at DESC LIMIT 100`, [serverId]);
    return reply.send({ entries: r.rows });
  });
}
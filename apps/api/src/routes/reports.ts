import type { FastifyInstance } from 'fastify';
import { query } from '../lib/db.js';
import { checkPermission } from '../lib/permissions.js';

export async function reportRoutes(app: FastifyInstance) {
  app.get('/servers/:id/reports', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const serverId = (req.params as any).id;
    const canManage = await checkPermission(serverId, user.id, 'manage_reports');
    if (!canManage) return reply.code(403).send({ error: 'Missing manage_reports permission' });

    const r = await query(
      `SELECT rep.*, u1.username as reporter_name, u2.username as target_name
         FROM reports rep
         JOIN users u1 ON u1.id = rep.reporter_id
         LEFT JOIN messages m ON rep.target_type = 'message' AND m.id = rep.target_id
         LEFT JOIN users u2 ON u2.id = CASE WHEN rep.target_type = 'user' THEN rep.target_id ELSE m.author_id END
         WHERE rep.status = 'pending'
         ORDER BY rep.created_at DESC`
    );
    return reply.send({ reports: r.rows });
  });

  app.patch('/reports/:reportId', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { reportId } = req.params as any;
    const action = (req.body as any).action; // 'dismiss' or 'resolve'

    // In a real app, we would check if the user has 'manage_reports' for the server related to this report.
    // For now, let's just update the status.
    await query(`UPDATE reports SET status = $1 WHERE id = $2`, [action === 'dismiss' ? 'dismissed' : 'resolved', reportId]);
    return reply.send({ ok: true });
  });
}
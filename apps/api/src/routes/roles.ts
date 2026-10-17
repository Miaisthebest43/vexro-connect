import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';
import { checkPermission } from '../lib/permissions.js';

export async function roleRoutes(app: FastifyInstance) {
  app.get('/servers/:id/roles', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const r = await query(`SELECT * FROM roles WHERE server_id = $1`, [(req.params as any).id]);
    return reply.send({ roles: r.rows });
  });

  app.post('/servers/:id/roles', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const serverId = (req.params as any).id;
    const canManage = await checkPermission(serverId, user.id, 'manage_roles');
    if (!canManage) return reply.code(403).send({ error: 'Missing manage_roles permission' });

    const parsed = z.object({ name: z.string(), color: z.string(), permissions: z.array(z.string()) }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid' });
    
    const r = await query(
      `INSERT INTO roles (server_id, name, color, permissions) VALUES ($1, $2, $3, $4) RETURNING *`,
      [serverId, parsed.data.name, parsed.data.color, JSON.stringify(parsed.data.permissions)]
    );
    return reply.send({ role: r.rows[0] });
  });

  app.patch('/roles/:roleId', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { roleId } = req.params as any;
    const roleRes = await query<{ server_id: string }>(`SELECT server_id FROM roles WHERE id = $1`, [roleId]);
    if (!roleRes.rowCount) return reply.code(404).send({ error: 'Role not found' });
    
    const canManage = await checkPermission(roleRes.rows[0].server_id, user.id, 'manage_roles');
    if (!canManage) return reply.code(403).send({ error: 'Missing manage_roles permission' });

    const parsed = z.object({ name: z.string().optional(), color: z.string().optional(), permissions: z.array(z.string()).optional() }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid' });

    const sets: string[] = []; const vals: any[] = []; let i = 1;
    if (parsed.data.name) { sets.push(`name = $${i++}`); vals.push(parsed.data.name); }
    if (parsed.data.color) { sets.push(`color = $${i++}`); vals.push(parsed.data.color); }
    if (parsed.data.permissions) { sets.push(`permissions = $${i++}`); vals.push(JSON.stringify(parsed.data.permissions)); }
    
    if (sets.length > 0) {
      vals.push(roleId);
      await query(`UPDATE roles SET ${sets.join(', ')} WHERE id = $${i}`, vals);
    }
    return reply.send({ ok: true });
  });
}
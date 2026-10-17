import type { FastifyInstance } from 'fastify';
import { randomBytes } from 'node:crypto';
import { query } from '../lib/db.js';
import { isBanned } from '../lib/permissions.js';

function generateCode(): string { return randomBytes(6).toString('base64url'); }

export async function inviteRoutes(app: FastifyInstance) {
  app.post('/servers/:id/invites', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const m = await query(`SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`, [serverId, user.id]);
    if (!m.rowCount) return reply.code(403).send({ error: 'Not a member' });
    const code = generateCode();
    const r = await query(
      `INSERT INTO invites (code, server_id, created_by) VALUES ($1, $2, $3)
       RETURNING code, server_id, created_at`, [code, serverId, user.id]);
    return reply.code(201).send({ invite: r.rows[0] });
  });

  app.get('/invites/:code', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const { code } = req.params as { code: string };
    const r = await query(
      `SELECT i.server_id, s.name,
              (SELECT COUNT(*)::text FROM server_members WHERE server_id = i.server_id) as members
         FROM invites i JOIN servers s ON s.id = i.server_id
         WHERE i.code = $1 AND (i.expires_at IS NULL OR i.expires_at > now())
           AND (i.max_uses = 0 OR i.uses < i.max_uses)`, [code]);
    const invite = r.rows[0];
    if (!invite) return reply.code(404).send({ error: 'Invalid or expired invite' });
    return reply.send({ invite });
  });

  app.post('/invites/:code/redeem', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { code } = req.params as { code: string };
    const inv = await query<{ server_id: string; max_uses: number; uses: number }>(
      `SELECT server_id, max_uses, uses FROM invites WHERE code = $1 AND (expires_at IS NULL OR expires_at > now())`, [code]);
    const invite = inv.rows[0];
    if (!invite) return reply.code(404).send({ error: 'Invalid or expired invite' });
    if (invite.max_uses > 0 && invite.uses >= invite.max_uses) return reply.code(410).send({ error: 'Invite fully used' });

    if (await isBanned(invite.server_id, user.id)) return reply.code(403).send({ error: 'You are banned from this server' });

    const already = await query(`SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`, [invite.server_id, user.id]);
    if (!already.rowCount) {
      await query(`INSERT INTO server_members (server_id, user_id, role) VALUES ($1, $2, 'member')`, [invite.server_id, user.id]);
      await query(`UPDATE invites SET uses = uses + 1 WHERE code = $1`, [code]);
    }
    return reply.send({ serverId: invite.server_id });
  });

  app.get('/servers/:id/invites', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: serverId } = req.params as { id: string };
    const m = await query(`SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`, [serverId, user.id]);
    if (!m.rowCount) return reply.code(403).send({ error: 'Not a member' });
    const r = await query(`SELECT code, uses, max_uses, expires_at, created_at FROM invites WHERE server_id = $1 ORDER BY created_at DESC`, [serverId]);
    return reply.send({ invites: r.rows });
  });
}
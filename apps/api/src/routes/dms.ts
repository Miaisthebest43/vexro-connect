import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';

export async function dmRoutes(app: FastifyInstance) {
  app.post('/dms/group', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const parsed = z.object({ name: z.string().min(1), userIds: z.array(z.string().uuid()) }).safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid' });

    const ch = await query<{ id: string }>(
      `INSERT INTO channels (type, name) VALUES ('dm', $1) RETURNING id`, [parsed.data.name]);
    const channelId = ch.rows[0].id;

    // Add self
    await query(`INSERT INTO dm_participants (channel_id, user_id) VALUES ($1, $2)`, [channelId, user.id]);
    // Add others
    for (const uid of parsed.data.userIds) {
      await query(`INSERT INTO dm_participants (channel_id, user_id) VALUES ($1, $2)`, [channelId, uid]);
    }
    return reply.send({ channelId });
  });

  app.get('/dms/group', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const r = await query(
      `SELECT c.id, c.name FROM channels c JOIN dm_participants p ON p.channel_id = c.id WHERE p.user_id = $1 AND c.type = 'dm'`,
      [user.id]);
    return reply.send({ dms: r.rows });
  });
}
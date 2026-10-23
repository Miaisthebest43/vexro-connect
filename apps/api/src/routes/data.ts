import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../lib/auth.js';

export async function dataRoutes(app: FastifyInstance) {
  app.get('/data/communities', { preHandler: requireAuth }, async (req) => {
    const { rows } = await app.pg.query('SELECT id, name, description FROM communities LIMIT 50');
    return { communities: rows };
  });

  app.get('/data/notifications', { preHandler: requireAuth }, async (req) => {
    const user = req.user!;
    const { rows } = await app.pg.query('SELECT id, title, body FROM notifications WHERE user_id = $1 LIMIT 20', [user.id]);
    return { notifications: rows };
  });

  app.get('/data/messages/:channelId', { preHandler: requireAuth }, async (req) => {
    const { channelId } = req.params as { channelId: string };
    const { rows } = await app.pg.query(
      `SELECT m.id, m.content, m.channel_id, m.created_at, u.username 
       FROM messages m JOIN users u ON u.id = m.user_id
       WHERE m.channel_id = $1 ORDER BY m.created_at ASC LIMIT 100`,
      [channelId]
    );
    return { messages: rows };
  });
}
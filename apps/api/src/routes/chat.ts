import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../lib/auth.js';

export async function chatRoutes(app: FastifyInstance) {
  app.get('/channels/:channelId/messages', { preHandler: requireAuth }, async (req, reply) => {
    const { channelId } = req.params as { channelId: string };
    const { rows } = await app.pg.query(
      `SELECT m.id, m.content, m.channel_id, m.created_at, u.username, u.id as user_id
       FROM messages m JOIN users u ON u.id = m.user_id
       WHERE channel_id = $1 ORDER BY m.created_at ASC LIMIT 50`,
      [channelId]
    );
    return { messages: rows };
  });

  app.get('/ws/chat', { websocket: true }, (connection, req) => {
    connection.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'chat') {
          const { rows } = await app.pg.query(
            `INSERT INTO messages (channel_id, user_id, content) 
             VALUES ($1, $2, $3) RETURNING id, channel_id, content, created_at`,
            [data.channelId, data.userId, data.content]
          );
          const { rows: userRows } = await app.pg.query(`SELECT username FROM users WHERE id = $1`, [data.userId]);
          
          const payload = JSON.stringify({
            type: 'chat',
            message: { ...rows[0], username: userRows[0].username, user_id: data.userId }
          });
          
          app.websocketServer.clients.forEach((client) => {
            if (client.readyState === 1) client.send(payload);
          });
        }
      } catch (e) { console.error(e); }
    });
  });
}
import type { FastifyInstance } from 'fastify';
import { AccessToken } from 'livekit-server-sdk';
import { query } from '../lib/db.js';

export async function voiceRoutes(app: FastifyInstance) {
  app.post('/channels/:id/voice-token', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const user = req.user!;
    const { id: channelId } = req.params as { id: string };

    // Verify user is in the server
    const m = await query(
      `SELECT c.server_id, s.name as server_name
         FROM channels c JOIN servers s ON s.id = c.server_id
         JOIN server_members sm ON sm.server_id = c.server_id
         WHERE c.id = $1 AND sm.user_id = $2`, [channelId, user.id]
    );
    if (!m.rowCount) return reply.code(403).send({ error: 'Not a member' });

    const roomName = `voice_${channelId}`;
    
    const at = new AccessToken('devkey', 'secret', {
      identity: user.id,
      name: user.username,
    });
    
    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

    return reply.send({ token: await at.toJwt(), roomName });
  });
}
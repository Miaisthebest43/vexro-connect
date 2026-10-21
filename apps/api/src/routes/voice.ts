import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../lib/auth.js';
import { AccessToken } from 'livekit-server-sdk';

export async function voiceRoutes(app: FastifyInstance) {
  app.post('/voice/token', { preHandler: requireAuth }, async (req) => {
    const { roomName } = req.body as { roomName: string };
    const user = req.user!;

    const at = new AccessToken('devkey', 'secret', {
      identity: user.id,
      name: user.username,
      ttl: '1h',
    });
    at.addGrant({ roomJoin: true, room: roomName });
    const token = await at.toJwt();
    return { token };
  });
}
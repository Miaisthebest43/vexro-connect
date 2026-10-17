import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registerPushToken, unregisterPushToken } from '../lib/push.js';

const registerSchema = z.object({
  token: z.string().min(10).max(200),
  platform: z.enum(['ios', 'android', 'web']),
});

const unregisterSchema = z.object({
  token: z.string().min(10).max(200),
});

export async function pushRoutes(app: FastifyInstance) {
  app.post('/push/register', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    await registerPushToken(req.user!.id, parsed.data.token, parsed.data.platform);
    return reply.send({ ok: true });
  });

  app.post('/push/unregister', { preHandler: [app.requireAuth] }, async (req, reply) => {
    const parsed = unregisterSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Validation Error' });
    await unregisterPushToken(parsed.data.token);
    return reply.send({ ok: true });
  });
}
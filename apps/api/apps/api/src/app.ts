import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { registerSecurity } from './plugins/security.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';
import { verifyRoutes } from './routes/verify.js';
import { dataRoutes } from './routes/data.js';
import { chatRoutes } from './routes/chat.js';
import { voiceRoutes } from './routes/voice.js';
import dbPlugin from './plugins/db.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' }, trustProxy: true, bodyLimit: 1_048_576 });

  await app.register(cors, { origin: true, credentials: true });
  await app.register(websocket);
  await registerSecurity(app);
  await app.register(dbPlugin);

  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(verifyRoutes);
  await app.register(dataRoutes);
  await app.register(chatRoutes);
  await app.register(voiceRoutes);

  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'Route not found' });
  });

  return app;
}
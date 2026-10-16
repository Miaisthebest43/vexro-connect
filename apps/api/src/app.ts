import Fastify, { type FastifyInstance } from 'fastify';
import { registerSecurity } from './plugins/security.js';
import { healthRoutes } from './routes/health.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL ?? 'info' },
    trustProxy: true,
    bodyLimit: 1_048_576,
  });

  await registerSecurity(app);
  await app.register(healthRoutes);

  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Route ' + req.method + ' ' + req.url + ' not found',
    });
  });

  return app;
}
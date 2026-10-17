import 'dotenv/config';
import Fastify, { type FastifyInstance } from 'fastify';
import { registerSecurity } from './plugins/security.js';
import authPlugin from './plugins/auth.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL ?? 'info' },
    trustProxy: true,
    bodyLimit: 1_048_576,
  });

  await registerSecurity(app);
  await app.register(authPlugin);
  await app.register(healthRoutes);
  await app.register(authRoutes);

  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Route ' + req.method + ' ' + req.url + ' not found',
    });
  });

  app.setErrorHandler((err, _req, reply) => {
    const status = (err as any).statusCode ?? 500;
    if (status >= 500) app.log.error(err);
    reply.code(status).send({
      error: status >= 500 ? 'Internal Server Error' : (err.name || 'Error'),
      message: status >= 500 ? 'Something went wrong' : err.message,
    });
  });

  return app;
}
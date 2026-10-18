import 'dotenv/config';
import Fastify, { type FastifyInstance } from 'fastify';
import { registerSecurity } from './plugins/security.js';
import authPlugin from './plugins/auth.js';
import wsPlugin from './plugins/ws.js';
import staticPlugin from './plugins/static.js';
import multipartPlugin from './plugins/multipart.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';
import { serverRoutes } from './routes/servers.js';
import { messageRoutes } from './routes/messages.js';
import { inviteRoutes } from './routes/invites.js';
import { profileRoutes } from './routes/profile.js';
import { uploadRoutes } from './routes/upload.js';
import { pushRoutes } from './routes/push.js';
import { friendRoutes } from './routes/friends.js';
import { notificationRoutes } from './routes/notifications.js';
import { safetyRoutes } from './routes/safety.js';
import { auditRoutes } from './routes/audit.js';
import { roleRoutes } from './routes/roles.js';
import { reportRoutes } from './routes/reports.js';
import { sessionRoutes } from './routes/sessions.js';
import { dmRoutes } from './routes/dms.js';
import { discoveryRoutes } from './routes/discovery.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL ?? 'info' },
    trustProxy: true,
    bodyLimit: 10_485_760,
  });

  await app.register(staticPlugin);
  await app.register(multipartPlugin);
  await registerSecurity(app);
  await app.register(authPlugin);
  await app.register(wsPlugin);

  // Core
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(serverRoutes);
  await app.register(messageRoutes);
  await app.register(inviteRoutes);
  await app.register(profileRoutes);
  await app.register(uploadRoutes);
  await app.register(pushRoutes);
  await app.register(friendRoutes);

  // Features
  await app.register(notificationRoutes);
  await app.register(safetyRoutes);
  await app.register(auditRoutes);
  await app.register(roleRoutes);
  await app.register(reportRoutes);
  await app.register(sessionRoutes);
  await app.register(dmRoutes);
  await app.register(discoveryRoutes);

  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send({ statusCode: 404, error: 'Not Found', message: 'Route not found' });
  });

  app.setErrorHandler((err: Error & { statusCode?: number }, _req, reply) => {
    const status = err.statusCode ?? 500;
    if (status >= 500) app.log.error(err);
    reply.code(status).send({
      error: status >= 500 ? 'Internal Server Error' : (err.name || 'Error'),
      message: status >= 500 ? 'Something went wrong' : err.message,
    });
  });

  return app;
}
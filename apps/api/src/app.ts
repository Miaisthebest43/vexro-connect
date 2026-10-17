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
import { discoveryRoutes } from './routes/discovery.js';
import { roleRoutes } from './routes/roles.js';
import { searchRoutes } from './routes/search.js';
import { voiceRoutes } from './routes/voice.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' }, trustProxy: true, bodyLimit: 10_485_760 });
  await app.register(staticPlugin);
  await app.register(multipartPlugin);
  await registerSecurity(app);
  await app.register(authPlugin);
  await app.register(wsPlugin);
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(serverRoutes);
  await app.register(messageRoutes);
  await app.register(inviteRoutes);
  await app.register(profileRoutes);
  await app.register(uploadRoutes);
  await app.register(pushRoutes);
  await app.register(friendRoutes);
  await app.register(discoveryRoutes);
  await app.register(roleRoutes);
  await app.register(searchRoutes);
  await app.register(voiceRoutes);

  app.setNotFoundHandler((req, reply) => { reply.code(404).send({ error: 'Not Found' }); });
  app.setErrorHandler((err, _req, reply) => {
    const status = (err as any).statusCode ?? 500;
    if (status >= 500) app.log.error(err);
    reply.code(status).send({ error: err.message || 'Something went wrong' });
  });
  return app;
}
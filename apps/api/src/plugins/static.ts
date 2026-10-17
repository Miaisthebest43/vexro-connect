import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

export default fp(async function staticPlugin(app: FastifyInstance) {
  const uploadsDir = join(process.cwd(), 'uploads');
  mkdirSync(uploadsDir, { recursive: true });

  await app.register(fastifyStatic, {
    root: uploadsDir,
    prefix: '/uploads/',
    decorateReply: false,
  });
});
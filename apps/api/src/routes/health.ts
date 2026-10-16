import type { FastifyInstance } from 'fastify';
import { API_VERSION, APP_NAME, APP_TAGLINE } from '@vexro/shared';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({
    status: 'ok',
    name: APP_NAME,
    tagline: APP_TAGLINE,
    version: API_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));
}
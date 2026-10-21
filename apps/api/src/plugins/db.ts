import fp from 'fastify-plugin';
import pg from 'pg';
import type { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

declare module 'fastify' {
  interface FastifyInstance {
    pg: pg.Pool;
  }
}

export default fp(async (app: FastifyInstance) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from .env');
  }
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query('SELECT 1');
  app.decorate('pg', pool);
  app.addHook('onClose', async () => { await pool.end(); });
}, { name: 'db' });
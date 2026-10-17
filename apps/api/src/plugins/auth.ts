import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { findSessionByToken } from '../lib/sessions.js';
import { query } from '../lib/db.js';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest) => Promise<void>;
  }
}

export default fp(async function authPlugin(app: FastifyInstance) {
  app.decorateRequest('user', undefined);

  app.decorate('requireAuth', async function (req: FastifyRequest) {
    const raw = req.cookies['vexro_session'];
    if (!raw) {
      const err: any = new Error('Not authenticated');
      err.statusCode = 401;
      throw err;
    }

    const unsigned = req.unsignCookie(raw);
    if (!unsigned.valid || !unsigned.value) {
      const err: any = new Error('Invalid session cookie');
      err.statusCode = 401;
      throw err;
    }

    const session = await findSessionByToken(unsigned.value);
    if (!session) {
      const err: any = new Error('Session expired');
      err.statusCode = 401;
      throw err;
    }

    const result = await query<{ id: string; email: string; username: string }>(
      `SELECT id, email, username FROM users WHERE id = $1`,
      [session.userId]
    );
    const user = result.rows[0];
    if (!user) {
      const err: any = new Error('User not found');
      err.statusCode = 401;
      throw err;
    }
    req.user = user;
  });
});
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
    sessionToken?: string;
  }
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest) => Promise<void>;
  }
}

function extractToken(req: FastifyRequest): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  const raw = req.cookies?.['vexro_session'];
  if (raw) {
    const unsigned = req.unsignCookie(raw);
    if (unsigned.valid && unsigned.value) return unsigned.value;
  }
  return null;
}

export default fp(async function authPlugin(app: FastifyInstance) {
  app.decorateRequest('user', undefined);
  app.decorateRequest('sessionToken', undefined);

  app.decorate('requireAuth', async function (req: FastifyRequest) {
    const token = extractToken(req);
    if (!token) {
      const err: any = new Error('Not authenticated');
      err.statusCode = 401;
      throw err;
    }

    const session = await findSessionByToken(token);
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
    req.sessionToken = token;
  });
});
import type { FastifyInstance } from 'fastify';
import { registerSchema, loginSchema } from '@vexro/shared';
import { hashPassword, verifyPassword, DUMMY_HASH_PROMISE } from '../lib/password.js';
import { createSession, deleteSession } from '../lib/sessions.js';
import { requireAuth } from '../lib/auth.js';

const COOKIE_OPTS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60,
};

const TEST = process.env.NODE_ENV === 'test';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', TEST ? {} : {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
  }, async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid input', issues: parsed.error.issues });
    }
    const { email, username, password } = parsed.data;

    const dup = await app.pg.query(
      'SELECT 1 FROM users WHERE email = $1 OR username = $2 LIMIT 1',
      [email, username]
    );
    if (dup.rowCount && dup.rowCount > 0) {
      return reply.code(409).send({ error: 'Email or username already in use' });
    }

    const passwordHash = await hashPassword(password);
    let user;
    try {
      const { rows } = await app.pg.query(
        `INSERT INTO users (email, username, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, username, created_at`,
        [email, username, passwordHash]
      );
      user = rows[0];
    } catch (e: any) {
      if (e.code === '23505') return reply.code(409).send({ error: 'Email or username already in use' });
      throw e;
    }

    const { token } = await createSession(app.pg, user.id, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    reply.setCookie('session', token, COOKIE_OPTS);
    return reply.code(201).send({ user });
  });

  app.post('/auth/login', TEST ? {} : {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
  }, async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid input' });
    const { email, password } = parsed.data;

    const { rows } = await app.pg.query(
      'SELECT id, email, username, password_hash FROM users WHERE email = $1',
      [email]
    );
    const row = rows[0];
    const hashToCheck = row?.password_hash ?? (await DUMMY_HASH_PROMISE);
    const ok = await verifyPassword(hashToCheck, password);

    if (!row || !ok) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }

    const { token } = await createSession(app.pg, row.id, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    reply.setCookie('session', token, COOKIE_OPTS);
    return { user: { id: row.id, email: row.email, username: row.username } };
  });

  app.post('/auth/logout', async (req, reply) => {
    const token = req.cookies.session;
    if (token) await deleteSession(app.pg, token);
    reply.clearCookie('session', { path: '/' });
    return { ok: true };
  });

  app.get('/auth/me', { preHandler: requireAuth }, async (req) => ({ user: req.user }));
}
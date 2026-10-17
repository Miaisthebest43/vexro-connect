import type { FastifyInstance, FastifyReply } from 'fastify';
import { registerSchema, loginSchema } from '@vexro/shared';
import { query } from '../lib/db.js';
import { hashPassword, verifyPassword } from '../lib/passwords.js';
import { generateSessionToken, createSession, deleteSession } from '../lib/sessions.js';

const SESSION_COOKIE = 'vexro_session';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', {
    config: { rateLimit: { max: 5, timeWindow: '10 minutes' } },
  }, async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'Validation Error',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      });
    }
    const { email, username, password } = parsed.data;

    const existing = await query<{ id: string }>(
      `SELECT id FROM users WHERE email = $1 OR username = $2 LIMIT 1`,
      [email, username]
    );
    if (existing.rowCount && existing.rowCount > 0) {
      return reply.code(409).send({ error: 'Email or username already taken' });
    }

    const passwordHash = await hashPassword(password);
    const inserted = await query<{ id: string; email: string; username: string }>(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, passwordHash]
    );
    const user = inserted.rows[0]!;

    const token = generateSessionToken();
    await createSession(user.id, token, { userAgent: req.headers['user-agent'] });
    setSessionCookie(reply, token);

    return reply.code(201).send({ user, token });
  });

  app.post('/auth/login', {
    config: { rateLimit: { max: 10, timeWindow: '10 minutes' } },
  }, async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation Error' });
    }
    const { email, password } = parsed.data;

    const result = await query<{
      id: string; email: string; username: string; password_hash: string;
    }>(`SELECT id, email, username, password_hash FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];

    if (!user) return reply.code(401).send({ error: 'Invalid email or password' });
    const ok = await verifyPassword(user.password_hash, password);
    if (!ok) return reply.code(401).send({ error: 'Invalid email or password' });

    const token = generateSessionToken();
    await createSession(user.id, token, { userAgent: req.headers['user-agent'] });
    setSessionCookie(reply, token);

    return reply.send({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  });

  app.post('/auth/logout', async (req, reply) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      await deleteSession(auth.slice(7).trim());
    }
    const raw = req.cookies[SESSION_COOKIE];
    if (raw) {
      const unsigned = req.unsignCookie(raw);
      if (unsigned.valid && unsigned.value) await deleteSession(unsigned.value);
    }
    reply.clearCookie(SESSION_COOKIE, { path: '/' });
    return reply.send({ ok: true });
  });

  app.get('/auth/me', { preHandler: [app.requireAuth] }, async (req, reply) => {
    return reply.send({ user: req.user });
  });
}
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { closePool, query } from '../src/lib/db.js';

let app: FastifyInstance;
const testEmail = `test-${Date.now()}@vexro.test`;
const testUser = `t${Date.now()}`;
const testPass = 'SuperSecret123';

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await query(`DELETE FROM users WHERE email = $1`, [testEmail]);
  await closePool();
  await app.close();
});

describe('POST /auth/register', () => {
  it('rejects weak password', async () => {
    const res = await app.inject({
      method: 'POST', url: '/auth/register',
      payload: { email: 'a@b.com', username: 'u1', password: 'weak' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('registers a new user', async () => {
    const res = await app.inject({
      method: 'POST', url: '/auth/register',
      payload: { email: testEmail, username: testUser, password: testPass },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.user.email).toBe(testEmail);
    expect(body.user.username).toBe(testUser);
    expect(body.user.password_hash).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const res = await app.inject({
      method: 'POST', url: '/auth/register',
      payload: { email: testEmail, username: testUser + 'x', password: testPass },
    });
    expect(res.statusCode).toBe(409);
  });
});

describe('POST /auth/login', () => {
  it('rejects wrong password', async () => {
    const res = await app.inject({
      method: 'POST', url: '/auth/login',
      payload: { email: testEmail, password: 'WrongPassword123' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('rejects unknown email', async () => {
    const res = await app.inject({
      method: 'POST', url: '/auth/login',
      payload: { email: 'nobody@vexro.test', password: testPass },
    });
    expect(res.statusCode).toBe(401);
  });

  it('logs in with correct credentials', async () => {
    const res = await app.inject({
      method: 'POST', url: '/auth/login',
      payload: { email: testEmail, password: testPass },
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(String(res.headers['set-cookie'])).toContain('vexro_session');
  });
});

describe('GET /auth/me', () => {
  it('returns 401 without session', async () => {
    const res = await app.inject({ method: 'GET', url: '/auth/me' });
    expect(res.statusCode).toBe(401);
  });
});
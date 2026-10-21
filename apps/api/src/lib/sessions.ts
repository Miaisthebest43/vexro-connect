import { randomBytes, createHash } from 'node:crypto';
import type pg from 'pg';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export async function createSession(
  pool: pg.Pool,
  userId: string,
  meta: { ip?: string; userAgent?: string }
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await pool.query(
    `INSERT INTO sessions (user_id, token_hash, expires_at, ip_hash, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, hashToken(token), expiresAt, meta.ip ? hashToken(meta.ip) : null, meta.userAgent ?? null]
  );
  return { token, expiresAt };
}

export async function validateSession(pool: pg.Pool, token: string) {
  const { rows } = await pool.query(
    `SELECT s.id AS session_id, s.revoked_at, s.expires_at,
            u.id AS user_id, u.email, u.username
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1`,
    [hashToken(token)]
  );
  const row = rows[0];
  if (!row || row.revoked_at || new Date(row.expires_at) < new Date()) return null;
  return {
    sessionId: row.session_id,
    user: { id: row.user_id, email: row.email, username: row.username },
  };
}

export async function deleteSession(pool: pg.Pool, token: string): Promise<void> {
  await pool.query(
    `DELETE FROM sessions WHERE token_hash = $1`,
    [hashToken(token)]
  );
}
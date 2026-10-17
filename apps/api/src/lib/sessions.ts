import { randomBytes, createHash } from 'node:crypto';
import { query } from './db.js';

const SESSION_TTL_DAYS = 30;

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(
  userId: string,
  token: string,
  meta: { userAgent?: string } = {}
): Promise<void> {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at, user_agent)
     VALUES ($1, $2, $3, $4)`,
    [userId, tokenHash, expiresAt, meta.userAgent ?? null]
  );
}

export async function findSessionByToken(token: string): Promise<{
  id: string; userId: string; expiresAt: Date;
} | null> {
  const tokenHash = hashToken(token);
  const result = await query<{ id: string; user_id: string; expires_at: Date }>(
    `SELECT id, user_id, expires_at FROM sessions WHERE token_hash = $1`,
    [tokenHash]
  );
  const row = result.rows[0];
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  return { id: row.id, userId: row.user_id, expiresAt: row.expires_at };
}

export async function deleteSession(token: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE token_hash = $1`, [hashToken(token)]);
}
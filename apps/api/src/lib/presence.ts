import { query } from './db.js';

const online = new Map<string, number>(); // userId -> last ping ms

export function markOnline(userId: string) {
  online.set(userId, Date.now());
}

export function markOffline(userId: string) {
  online.delete(userId);
  query(`UPDATE users SET status = 'offline', last_seen = now() WHERE id = $1`, [userId]).catch(() => {});
}

export function getStatus(userId: string): 'online' | 'idle' | 'dnd' | 'offline' {
  const last = online.get(userId);
  if (!last) return 'offline';
  const age = Date.now() - last;
  if (age > 5 * 60_000) return 'idle';
  return 'online';
}

export function onlineUserIds(): string[] {
  return Array.from(online.keys());
}

// Also let users set their own status override
export async function setUserStatus(userId: string, status: 'online' | 'idle' | 'dnd' | 'offline') {
  await query(`UPDATE users SET status = $1 WHERE id = $2`, [status, userId]);
}
import { query } from './db.js';

export type Role = 'owner' | 'admin' | 'member';

export async function getMemberRole(serverId: string, userId: string): Promise<Role | null> {
  const r = await query<{ role: string }>(
    `SELECT role FROM server_members WHERE server_id = $1 AND user_id = $2`,
    [serverId, userId]
  );
  const row = r.rows[0];
  if (!row) return null;
  return (row.role as Role) ?? 'member';
}

export function can(role: Role | null, action: 'manage_server' | 'manage_channels' | 'kick' | 'ban' | 'delete_any_message'): boolean {
  if (!role) return false;
  if (role === 'owner') return true;
  if (role === 'admin') {
    return action !== 'manage_server'; // admins can't delete/transfer server
  }
  return false;
}

export async function isBanned(serverId: string, userId: string): Promise<boolean> {
  const r = await query(
    `SELECT 1 FROM bans WHERE server_id = $1 AND user_id = $2`,
    [serverId, userId]
  );
  return !!r.rowCount;
}
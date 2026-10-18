import { query } from './db.js';

export type Role = 'owner' | 'admin' | 'member';
export type Permission = 
  | 'manage_server' | 'manage_channels' | 'manage_roles' 
  | 'kick_members' | 'ban_members' | 'delete_messages' | 'manage_reports';

// Old synchronous check (kept for backward compatibility with older routes)
export function can(role: Role | null, action: 'manage_server' | 'manage_channels' | 'kick' | 'ban' | 'delete_any_message'): boolean {
  if (!role) return false;
  if (role === 'owner') return true;
  if (role === 'admin') {
    return action !== 'manage_server'; // admins can't delete/transfer server
  }
  return false;
}

// New async permission engine (for Roles)
export async function getMemberRole(serverId: string, userId: string): Promise<Role | null> {
  const r = await query<{ role: string }>(
    `SELECT role FROM server_members WHERE server_id = $1 AND user_id = $2`,
    [serverId, userId]
  );
  const row = r.rows[0];
  if (!row) return null;
  return (row.role as Role) ?? 'member';
}

export async function checkPermission(serverId: string, userId: string, permission: Permission): Promise<boolean> {
  const r = await query<{ role: string; role_perms: string[] }>(
    `SELECT sm.role, r.permissions as role_perms
       FROM server_members sm
       LEFT JOIN roles r ON r.id = sm.role_id
       WHERE sm.server_id = $1 AND sm.user_id = $2`,
    [serverId, userId]
  );
  const member = r.rows[0];
  if (!member) return false;

  if (member.role === 'owner') return true;
  if (member.role_perms && member.role_perms.includes(permission)) return true;

  if (member.role === 'admin') {
    return permission !== 'manage_server';
  }

  return false;
}

export async function isBanned(serverId: string, userId: string): Promise<boolean> {
  const r = await query(`SELECT 1 FROM bans WHERE server_id = $1 AND user_id = $2`, [serverId, userId]);
  return !!r.rowCount;
}
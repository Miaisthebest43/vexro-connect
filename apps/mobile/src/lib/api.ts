import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'vexro_token';
export const WS_URL = API_URL.replace(/^http/, 'ws') + '/ws';
export { API_URL };

export function absUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

export async function getToken() {
  if (Platform.OS === 'web') return localStorage.getItem(TOKEN_KEY);
  return SecureStore.getItemAsync(TOKEN_KEY);
}
export async function setToken(t: string) {
  if (Platform.OS === 'web') { localStorage.setItem(TOKEN_KEY, t); return; }
  await SecureStore.setItemAsync(TOKEN_KEY, t);
}
export async function clearToken() {
  if (Platform.OS === 'web') { localStorage.removeItem(TOKEN_KEY); return; }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function request<T>(path: string, options: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) { const t = await getToken(); if (t) headers.Authorization = `Bearer ${t}`; }
  const res = await fetch(`${API_URL}${path}`, {
      credentials: 'include', method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status})`);
  return data as T;
}

export interface User { id: string; email: string; username: string; avatar_url?: string | null; bio?: string | null; status?: string; }
export interface Server { id: string; name: string; icon_url: string | null; owner_id: string; created_at: string; }
export interface Channel { id: string; name: string; category_id: string | null; position: number; }
export interface Category { id: string; name: string; position: number; }
export interface ServerDetail extends Server { channels: Channel[]; categories: Category[]; }
export interface Reaction { emoji: string; count: number; users: string[]; }
export interface ReplyTo { id: string; content: string; username: string; }
export interface Message {
  id: string; content: string; created_at: string; edited_at: string | null;
  author_id: string; username: string; display_name?: string; avatar_url: string | null;
  attachment_url: string | null; attachment_type: 'image' | 'file' | null;
  attachment_width: number | null; attachment_height: number | null;
  reply_to_id: string | null; reply_to: ReplyTo | null; pinned: boolean;
  reactions?: Reaction[];
}
export interface Member {
  id: string; username: string; avatar_url: string | null; status: string;
  bio: string | null; role: string; nickname: string | null; joined_at: string;
}
export interface Invite { code: string; uses: number; max_uses: number; expires_at: string | null; created_at: string; }
export interface Ban { user_id: string; username: string; reason: string | null; created_at: string; }
export interface SearchResult { id: string; content: string; created_at: string; channel_id: string; channel_name: string; username: string; }

export const api = {
  register: (e: string, u: string, p: string) => request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: { email: e, username: u, password: p } }),
  login: (e: string, p: string) => request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: { email: e, password: p } }),
  me: () => request<{ user: User }>('/auth/me', { auth: true }),
  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST', auth: true }),
  updateMe: (body: { bio?: string; status?: 'online' | 'idle' | 'dnd' | 'offline' }) =>
    request<{ ok: boolean }>('/me', { method: 'PATCH', body, auth: true }),

  listServers: () => request<{ servers: Server[] }>('/servers', { auth: true }),
  createServer: (name: string, template: string = 'blank') => request<{ server: ServerDetail }>('/servers', { method: 'POST', body: { name, template }, auth: true }),
  getServer: (id: string) => request<{ server: ServerDetail; unread: Record<string, number>; myRole: string }>(`/servers/${id}`, { auth: true }),
  updateServer: (id: string, body: { name?: string; icon_url?: string }) =>
    request<{ server: Server }>(`/servers/${id}`, { method: 'PATCH', body, auth: true }),
  deleteServer: (id: string) => request<{ ok: boolean }>(`/servers/${id}`, { method: 'DELETE', auth: true }),
  transferServer: (id: string, newOwnerId: string) =>
    request<{ ok: boolean }>(`/servers/${id}/transfer`, { method: 'POST', body: { new_owner_id: newOwnerId }, auth: true }),

  createChannel: (serverId: string, name: string, category_id?: string) =>
    request<{ channel: Channel }>(`/servers/${serverId}/channels`, { method: 'POST', body: { name, category_id }, auth: true }),
  deleteChannel: (id: string) => request<{ ok: boolean }>(`/channels/${id}`, { method: 'DELETE', auth: true }),
  markRead: (channelId: string) => request<{ ok: boolean }>(`/channels/${channelId}/read`, { method: 'POST', auth: true }),

  createCategory: (serverId: string, name: string) =>
    request<{ category: Category }>(`/servers/${serverId}/categories`, { method: 'POST', body: { name }, auth: true }),
  deleteCategory: (id: string) => request<{ ok: boolean }>(`/categories/${id}`, { method: 'DELETE', auth: true }),

  listMessages: (channelId: string) => request<{ messages: Message[] }>(`/channels/${channelId}/messages`, { auth: true }),
  sendMessage: (channelId: string, payload: { content?: string; attachment_url?: string; attachment_type?: 'image' | 'file'; attachment_width?: number; attachment_height?: number; reply_to_id?: string }) =>
    request<{ message: Message }>(`/channels/${channelId}/messages`, { method: 'POST', body: payload, auth: true }),
  editMessage: (id: string, content: string) => request<{ ok: boolean }>(`/messages/${id}`, { method: 'PATCH', body: { content }, auth: true }),
  deleteMessage: (id: string) => request<{ ok: boolean }>(`/messages/${id}`, { method: 'DELETE', auth: true }),
  togglePin: (id: string) => request<{ ok: boolean; pinned: boolean }>(`/messages/${id}/pin`, { method: 'POST', auth: true }),
  listPins: (channelId: string) => request<{ pins: { id: string; content: string; created_at: string; username: string }[] }>(`/channels/${channelId}/pins`, { auth: true }),
  toggleReaction: (id: string, emoji: string) =>
    request<{ ok: boolean; action: string; reactions: Reaction[] }>(`/messages/${id}/reactions`, { method: 'POST', body: { emoji }, auth: true }),

  searchServer: (serverId: string, q: string) =>
    request<{ results: SearchResult[] }>(`/servers/${serverId}/search?q=${encodeURIComponent(q)}`, { auth: true }),

  listMembers: (serverId: string) => request<{ members: Member[] }>(`/servers/${serverId}/members`, { auth: true }),
  updateMember: (serverId: string, userId: string, body: { nickname?: string | null; role?: 'admin' | 'member' }) =>
    request<{ ok: boolean }>(`/servers/${serverId}/members/${userId}`, { method: 'PATCH', body, auth: true }),
  kickMember: (serverId: string, userId: string) =>
    request<{ ok: boolean }>(`/servers/${serverId}/members/${userId}`, { method: 'DELETE', auth: true }),

  banMember: (serverId: string, userId: string, reason?: string) =>
    request<{ ok: boolean }>(`/servers/${serverId}/bans`, { method: 'POST', body: { user_id: userId, reason }, auth: true }),
  unbanMember: (serverId: string, userId: string) =>
    request<{ ok: boolean }>(`/servers/${serverId}/bans/${userId}`, { method: 'DELETE', auth: true }),
  listBans: (serverId: string) => request<{ bans: Ban[] }>(`/servers/${serverId}/bans`, { auth: true }),

  createInvite: (serverId: string) => request<{ invite: Invite }>(`/servers/${serverId}/invites`, { method: 'POST', auth: true }),
  listInvites: (serverId: string) => request<{ invites: Invite[] }>(`/servers/${serverId}/invites`, { auth: true }),
  redeemInvite: (code: string) => request<{ serverId: string }>(`/invites/${code}/redeem`, { method: 'POST', auth: true }),

  // --- Friends & DMs ---
  listFriends: () => request<{ friends: any[], incoming: any[], outgoing: any[] }>('/friends', { auth: true }),
  requestFriend: (username: string) => request<{ ok: boolean }>('/friends/request', { method: 'POST', body: { username }, auth: true }),
  acceptFriend: (username: string) => request<{ ok: boolean }>('/friends/accept', { method: 'POST', body: { username }, auth: true }),
  listDMs: () => request<{ dms: any[] }>('/dms', { auth: true }),
  openDM: (userId: string) => request<{ channel: any }>('/dms', { method: 'POST', body: { userId }, auth: true }),

  discoverServers: () => request<{ servers: any[] }>('/discover', { auth: true }),
  createRole: (serverId: string, name: string, color: string) => request<{ role: any }>(`/servers/${serverId}/roles`, { method: 'POST', body: { name, color }, auth: true }),
  getRoles: (serverId: string) => request<{ roles: any[] }>(`/servers/${serverId}/roles`, { auth: true }),
  searchMessages: (channelId: string, q: string) => request<{ messages: any[] }>(`/channels/${channelId}/search?q=${encodeURIComponent(q)}`, { auth: true }),
  getRoles: (serverId: string) => request<{ roles: any[] }>(`/servers/${serverId}/roles`, { auth: true }),
  createRole: (serverId: string, name: string, color: string, permissions?: string[]) => request<{ role: any }>(`/servers/${serverId}/roles`, { method: 'POST', body: { name, color, permissions: permissions || [] }, auth: true }),
  updateRole: (roleId: string, body: any) => request<{ ok: boolean }>(`/roles/${roleId}`, { method: 'PATCH', body, auth: true }),
  getReports: (serverId: string) => request<{ reports: any[] }>(`/servers/${serverId}/reports`, { auth: true }),
  resolveReport: (reportId: string, action: 'dismiss' | 'resolve') => request<{ ok: boolean }>(`/reports/${reportId}`, { method: 'PATCH', body: { action }, auth: true }),
  listSessions: () => request<{ sessions: any[] }>('/sessions', { auth: true }),
  revokeSession: (id: string) => request<{ ok: boolean }>(`/sessions/${id}`, { method: 'DELETE', auth: true }),
  getThread: (channelId: string, parentId: string) => request<{ messages: any[] }>(`/channels/${channelId}/messages?parent_id=${parentId}`, { auth: true }),
  createGroupDM: (name: string, userIds: string[]) => request<{ channelId: string }>('/dms/group', { method: 'POST', body: { name, userIds }, auth: true }),
  listGroupDMs: () => request<{ dms: any[] }>('/dms/group', { auth: true }),
  getProfile: (userId: string) =>
    request<{ user: { id: string; username: string; bio: string | null; avatar_url: string | null; created_at: string; status: string; message_count: number; server_count: number } }>(`/users/${userId}`, { auth: true }),
};

export async function uploadFile(endpoint: '/upload/avatar' | '/upload/attachment', uri: string, mimeType = 'image/jpeg') {
  const token = await getToken();
  const form = new FormData();
  const name = uri.split('/').pop() ?? 'upload.jpg';
  // @ts-ignore
  form.append('file', { uri, name, type: mimeType });
  const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include', method: 'POST', headers: { Authorization: `Bearer ${token ?? ''}` }, body: form });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data as { url: string; type?: 'image' | 'file'; mime?: string; size?: number };
}

export async function registerPushToken(token: string, platform: 'ios' | 'android' | 'web') {
  await request('/push/register', { method: 'POST', body: { token, platform }, auth: true });
}
export async function unregisterPushToken(token: string) {
  await request('/push/unregister', { method: 'POST', body: { token }, auth: true });
}
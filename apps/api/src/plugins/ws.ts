import fp from 'fastify-plugin';
import websocket from '@fastify/websocket';
import type { FastifyInstance } from 'fastify';
import type { WebSocket } from 'ws';
import { findSessionByToken } from '../lib/sessions.js';
import { query } from '../lib/db.js';
import { markOnline, markOffline } from '../lib/presence.js';

interface ClientState {
  userId: string;
  username: string;
  subscriptions: Set<string>;
}

declare module 'fastify' {
  interface FastifyInstance {
    broadcastToChannel: (channelId: string, payload: unknown, except?: WebSocket) => void;
    broadcastPresence: (userId: string, status: string) => void;
    broadcastToServer: (serverId: string, payload: unknown) => Promise<void>;
  }
}

export default fp(async function wsPlugin(app: FastifyInstance) {
  await app.register(websocket);

  const clients = new Map<WebSocket, ClientState>();
  const channelSubs = new Map<string, Set<WebSocket>>();
  const serverSubs = new Map<string, Set<WebSocket>>();

  app.decorate('broadcastToChannel', (channelId, payload, except) => {
    const subs = channelSubs.get(channelId);
    if (!subs) return;
    const json = JSON.stringify(payload);
    for (const s of subs) if (s !== except && s.readyState === 1) s.send(json);
  });

  app.decorate('broadcastPresence', (userId, status) => {
    const json = JSON.stringify({ type: 'presence', userId, status });
    for (const s of clients.keys()) if (s.readyState === 1) s.send(json);
  });

  app.decorate('broadcastToServer', async (serverId, payload) => {
    const subs = serverSubs.get(serverId);
    if (!subs) return;
    const json = JSON.stringify(payload);
    for (const s of subs) if (s.readyState === 1) s.send(json);
  });

  app.get('/ws', { websocket: true }, async (socket, req) => {
    const url = new URL(req.url, 'http://x');
    const token = url.searchParams.get('token');
    if (!token) { socket.close(4001, 'No token'); return; }

    const session = await findSessionByToken(token);
    if (!session) { socket.close(4001, 'Invalid session'); return; }

    const u = await query<{ username: string }>(`SELECT username FROM users WHERE id = $1`, [session.userId]);
    const username = u.rows[0]?.username ?? 'unknown';

    markOnline(session.userId);
    await query(`UPDATE users SET status = 'online', last_seen = now() WHERE id = $1`, [session.userId]);
    app.broadcastPresence(session.userId, 'online');

    clients.set(socket, { userId: session.userId, username, subscriptions: new Set() });

    socket.on('message', async (raw) => {
      let msg: any; try { msg = JSON.parse(raw.toString()); } catch { return; }

      if (msg.type === 'subscribe' && typeof msg.channelId === 'string') {
        const r = await query(
          `SELECT 1 FROM channels c JOIN server_members sm ON sm.server_id = c.server_id
             WHERE c.id = $1 AND sm.user_id = $2`, [msg.channelId, session.userId]);
        if (!r.rowCount) return;
        clients.get(socket)?.subscriptions.add(msg.channelId);
        if (!channelSubs.has(msg.channelId)) channelSubs.set(msg.channelId, new Set());
        channelSubs.get(msg.channelId)!.add(socket);
        socket.send(JSON.stringify({ type: 'subscribed', channelId: msg.channelId }));
      }

      if (msg.type === 'subscribe_server' && typeof msg.serverId === 'string') {
        const r = await query(
          `SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2`,
          [msg.serverId, session.userId]);
        if (!r.rowCount) return;
        if (!serverSubs.has(msg.serverId)) serverSubs.set(msg.serverId, new Set());
        serverSubs.get(msg.serverId)!.add(socket);
      }

      if (msg.type === 'unsubscribe' && typeof msg.channelId === 'string') {
        const subs = channelSubs.get(msg.channelId);
        if (subs) { subs.delete(socket); if (subs.size === 0) channelSubs.delete(msg.channelId); }
      }

      if (msg.type === 'typing' && typeof msg.channelId === 'string') {
        const state = clients.get(socket);
        if (!state) return;
        app.broadcastToChannel(msg.channelId, {
          type: 'typing', channelId: msg.channelId,
          userId: session.userId, username: state.username,
        }, socket);
      }

      if (msg.type === 'presence_ping') {
        markOnline(session.userId);
        socket.send(JSON.stringify({ type: 'pong' }));
      }
    });

    socket.on('close', () => {
      const state = clients.get(socket);
      if (state) {
        for (const ch of state.subscriptions) {
          const subs = channelSubs.get(ch);
          if (subs) { subs.delete(socket); if (subs.size === 0) channelSubs.delete(ch); }
        }
      }
      clients.delete(socket);
      // Only mark offline if no other connection for this user
      const stillOnline = Array.from(clients.values()).some((c) => c.userId === session.userId);
      if (!stillOnline) {
        markOffline(session.userId);
        app.broadcastPresence(session.userId, 'offline');
      }
    });

    socket.send(JSON.stringify({ type: 'ready', userId: session.userId }));
  });
});
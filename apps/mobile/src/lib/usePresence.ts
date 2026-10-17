import { useEffect, useState } from 'react';
import { WS_URL, getToken } from './api';

export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline';
type StatusMap = Record<string, PresenceStatus>;

let sharedWs: WebSocket | null = null;
let sharedToken: string | null = null;
const sharedListeners: Set<(m: StatusMap) => void> = new Set();
let sharedStatus: StatusMap = {};

function notify() {
  const snapshot = { ...sharedStatus };
  sharedListeners.forEach((fn) => fn(snapshot));
}

async function ensureWs() {
  if (sharedWs && sharedWs.readyState <= 1) return;
  if (!sharedToken) sharedToken = await getToken();
  if (!sharedToken) return;

  const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(sharedToken)}`);
  sharedWs = ws;

  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'presence' && msg.userId && msg.status) {
        sharedStatus[msg.userId] = msg.status as PresenceStatus;
        notify();
      }
      if (msg.type === 'ready' && msg.userId) {
        sharedStatus[msg.userId] = 'online';
        notify();
      }
    } catch {}
  };

  ws.onclose = () => {
    sharedWs = null;
    setTimeout(ensureWs, 3000);
  };
}

export function usePresence() {
  const [statuses, setStatuses] = useState<StatusMap>({ ...sharedStatus });

  useEffect(() => {
    ensureWs();
    const listener = (map: StatusMap) => setStatuses(map);
    sharedListeners.add(listener);
    return () => { sharedListeners.delete(listener); };
  }, []);

  const getStatus = (userId: string): PresenceStatus => statuses[userId] ?? 'offline';
  return { statuses, getStatus };
}

export function statusColor(s: PresenceStatus | string): string {
  switch (s) {
    case 'online': return '#44dd88';
    case 'idle': return '#f5a623';
    case 'dnd': return '#ff4466';
    default: return '#5a5d68';
  }
}
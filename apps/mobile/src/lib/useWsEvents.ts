import { useEffect, useRef, useState } from 'react';
import { WS_URL, getToken } from './api';

export interface WsEvent { type: string; [key: string]: any; }

export function useWsEvents(onEvent: (e: WsEvent) => void) {
  const [connected, setConnected] = useState(false);
  const ref = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;
    (async () => {
      const token = await getToken();
      if (!token || cancelled) return;
      ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
      ref.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onmessage = (ev) => {
        try { onEvent(JSON.parse(ev.data)); } catch {}
      };
      ws.onclose = () => setConnected(false);
    })();
    return () => { cancelled = true; ws?.close(); ref.current = null; };
  }, []);

  return { connected, send: (msg: any) => { if (ref.current?.readyState === 1) ref.current.send(JSON.stringify(msg)); } };
}
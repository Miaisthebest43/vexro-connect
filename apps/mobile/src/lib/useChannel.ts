import { useEffect, useRef, useState } from 'react';
import { WS_URL, getToken, api, type Message } from './api';

export function useChannel(channelId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  // Load history + connect WS
  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;

    (async () => {
      try {
        const { messages } = await api.listMessages(channelId);
        if (!cancelled) setMessages(messages);
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }

      const token = await getToken();
      if (!token || cancelled) return;

      ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        ws?.send(JSON.stringify({ type: 'subscribe', channelId }));
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'message' && msg.channelId === channelId) {
            setMessages((prev) => [...prev, msg.message]);
          }
        } catch {}
      };

      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);
    })();

    return () => {
      cancelled = true;
      if (ws && ws.readyState === 1) {
        try { ws.send(JSON.stringify({ type: 'unsubscribe', channelId })); } catch {}
      }
      ws?.close();
      wsRef.current = null;
    };
  }, [channelId]);

  return { messages, connected, loading, setMessages };
}
import { useEffect, useRef, useState } from 'react';
import { WS_URL, getToken, api, type Message } from './api';

export function useChannel(channelId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;

    (async () => {
      try {
        const { messages } = await api.listMessages(channelId);
        if (!cancelled) setMessages(messages);
      } catch {}
      finally { if (!cancelled) setLoading(false); }

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
          if (msg.channelId !== channelId) return;
          if (msg.type === 'message') setMessages((prev) => [...prev, msg.message]);
          if (msg.type === 'message_deleted') {
            setMessages((prev) => prev.filter((m) => m.id !== msg.messageId));
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
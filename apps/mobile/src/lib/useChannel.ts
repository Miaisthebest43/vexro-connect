import { useCallback, useEffect, useRef, useState } from 'react';
import { WS_URL, getToken, api, type Message, type Reaction } from './api';

interface TypingUser { userId: string; username: string; at: number; }

export function useChannel(channelId: string, selfId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const lastTypingSent = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    let ws: WebSocket | null = null;

    (async () => {
      try { const { messages } = await api.listMessages(channelId); if (!cancelled) setMessages(messages); }
      catch {}
      finally { if (!cancelled) setLoading(false); }

      // Mark read
      api.markRead(channelId).catch(() => {});

      const token = await getToken();
      if (!token || cancelled) return;
      ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
      wsRef.current = ws;
      ws.onopen = () => { setConnected(true); ws?.send(JSON.stringify({ type: 'subscribe', channelId })); };
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.channelId && msg.channelId !== channelId) return;
          if (msg.type === 'message') { setMessages((prev) => [...prev, msg.message]); api.markRead(channelId).catch(() => {}); }
          if (msg.type === 'message_deleted') setMessages((prev) => prev.filter((m) => m.id !== msg.messageId));
          if (msg.type === 'message_edited') setMessages((prev) => prev.map((m) => m.id === msg.messageId ? { ...m, content: msg.content, edited_at: msg.edited_at } : m));
          if (msg.type === 'message_pinned') setMessages((prev) => prev.map((m) => m.id === msg.messageId ? { ...m, pinned: msg.pinned } : m));
          if (msg.type === 'reaction_updated') setMessages((prev) => prev.map((m) => m.id === msg.messageId ? { ...m, reactions: msg.reactions } : m));
          if (msg.type === 'typing' && msg.userId !== selfId) {
            setTypingUsers((prev) => [...prev.filter((u) => u.userId !== msg.userId), { userId: msg.userId, username: msg.username, at: Date.now() }]);
          }
        } catch {}
      };
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);

      // Keep presence alive
      const ping = setInterval(() => {
        if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: 'presence_ping' }));
      }, 60000);
      return () => clearInterval(ping);
    })();

    return () => {
      cancelled = true;
      if (ws && ws.readyState === 1) try { ws.send(JSON.stringify({ type: 'unsubscribe', channelId })); } catch {}
      ws?.close();
      wsRef.current = null;
    };
  }, [channelId, selfId]);

  useEffect(() => {
    const id = setInterval(() => { const cutoff = Date.now() - 3000; setTypingUsers((prev) => prev.filter((u) => u.at > cutoff)); }, 1000);
    return () => clearInterval(id);
  }, []);

  const sendTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastTypingSent.current < 1500) return;
    lastTypingSent.current = now;
    const ws = wsRef.current;
    if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type: 'typing', channelId }));
  }, [channelId]);

  const updateReactions = useCallback((messageId: string, reactions: Reaction[]) => {
    setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, reactions } : m));
  }, []);

  return { messages, connected, loading, typingUsers, sendTyping, updateReactions };
}
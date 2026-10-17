import { query } from './db.js';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: 'default';
}

async function sendBatch(messages: PushMessage[]): Promise<void> {
  if (messages.length === 0) return;
  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(messages),
    });
    if (!res.ok) {
      console.error('[push] send failed', res.status, await res.text());
    }
  } catch (e) {
    console.error('[push] exception', e);
  }
}

export async function notifyChannelMembers(
  channelId: string,
  excludeUserId: string,
  payload: { title: string; body: string; data?: Record<string, unknown> }
): Promise<void> {
  const r = await query<{ token: string }>(
    `SELECT DISTINCT pt.token
       FROM push_tokens pt
       JOIN server_members sm ON sm.user_id = pt.user_id
       JOIN channels c ON c.server_id = sm.server_id
       WHERE c.id = $1
         AND pt.user_id <> $2`,
    [channelId, excludeUserId]
  );

  const messages: PushMessage[] = r.rows.map((row) => ({
    to: row.token,
    title: payload.title,
    body: payload.body.slice(0, 200),
    data: payload.data,
    sound: 'default',
  }));

  await sendBatch(messages);
}

export async function registerPushToken(userId: string, token: string, platform: string): Promise<void> {
  await query(
    `INSERT INTO push_tokens (user_id, token, platform)
     VALUES ($1, $2, $3)
     ON CONFLICT (token) DO UPDATE
       SET user_id = EXCLUDED.user_id,
           platform = EXCLUDED.platform,
           last_seen = now()`,
    [userId, token, platform]
  );
}

export async function unregisterPushToken(token: string): Promise<void> {
  await query(`DELETE FROM push_tokens WHERE token = $1`, [token]);
}
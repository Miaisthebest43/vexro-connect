-- 1. Presence + 2. Bio
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'offline';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ NOT NULL DEFAULT now();

-- 3. Nickname per server + 6. Role permissions base
ALTER TABLE server_members ADD COLUMN IF NOT EXISTS nickname TEXT;

-- 4. Server icons
ALTER TABLE servers ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- 7. Bans
CREATE TABLE IF NOT EXISTS bans (
  server_id  UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  banned_by  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (server_id, user_id)
);

-- 9. Replies
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL;

-- 10. Pins
ALTER TABLE messages ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT false;

-- 12. Channel categories
CREATE TABLE IF NOT EXISTS categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id  UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS categories_server_idx ON categories (server_id);
ALTER TABLE channels ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;

-- 13. Unread tracking
CREATE TABLE IF NOT EXISTS channel_reads (
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel_id   UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, channel_id)
);
CREATE INDEX IF NOT EXISTS channel_reads_user_idx ON channel_reads (user_id);

-- 8. Mentions tracking
CREATE TABLE IF NOT EXISTS mentions (
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (message_id, user_id)
);

-- Search index (11)
CREATE INDEX IF NOT EXISTS messages_content_search_idx
  ON messages USING gin (to_tsvector('english', content));
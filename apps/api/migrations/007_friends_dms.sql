-- Friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status         TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted'
  action_user_id UUID NOT NULL REFERENCES users(id), -- Who sent the request
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Alter channels to support DMs (server_id becomes nullable)
ALTER TABLE channels ALTER COLUMN server_id DROP NOT NULL;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'server';
ALTER TABLE channels ADD COLUMN IF NOT EXISTS dm_user1_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS dm_user2_id UUID REFERENCES users(id) ON DELETE CASCADE;
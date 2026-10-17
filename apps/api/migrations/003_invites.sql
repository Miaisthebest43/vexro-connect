CREATE TABLE IF NOT EXISTS invites (
  code         TEXT PRIMARY KEY,
  server_id    UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  created_by   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  max_uses     INTEGER NOT NULL DEFAULT 0,
  uses         INTEGER NOT NULL DEFAULT 0,
  expires_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invites_server_idx ON invites (server_id);
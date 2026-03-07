CREATE TABLE IF NOT EXISTS skins (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color_hex TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS skin_id INTEGER REFERENCES skins(id) ON DELETE SET NULL;

INSERT INTO skins (name, color_hex) VALUES
  ('white', '#f8f3ff'),
  ('blue', '#5b8def'),
  ('green', '#4f9d69'),
  ('brown', '#8b5a2b'),
  ('red', '#c94a4a'),
  ('purple', '#8b5cf6'),
  ('orange', '#e07c3c'),
  ('cyan', '#22b8cf')
ON CONFLICT (name) DO NOTHING;

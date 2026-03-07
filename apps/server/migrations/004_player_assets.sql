ALTER TABLE player_state
  ADD COLUMN IF NOT EXISTS assets_json JSONB NOT NULL DEFAULT '{"hatAssetId":"cap","shoesAssetId":"sneakers"}'::jsonb;


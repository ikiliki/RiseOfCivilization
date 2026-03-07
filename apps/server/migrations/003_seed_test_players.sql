-- Seed test players ikiliki (brown) and ikiliki1 (green) when Docker starts.
-- Idempotent: only inserts if users don't exist.

DO $$
DECLARE
  v_green_skin INTEGER;
  v_brown_skin INTEGER;
BEGIN
  SELECT id INTO v_green_skin FROM skins WHERE name = 'green' LIMIT 1;
  SELECT id INTO v_brown_skin FROM skins WHERE name = 'brown' LIMIT 1;

  IF v_green_skin IS NULL OR v_brown_skin IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO users (username, skin_id)
  VALUES ('ikiliki', v_brown_skin)
  ON CONFLICT (username) DO UPDATE SET skin_id = EXCLUDED.skin_id;

  INSERT INTO users (username, skin_id)
  VALUES ('ikiliki1', v_green_skin)
  ON CONFLICT (username) DO UPDATE SET skin_id = EXCLUDED.skin_id;

  INSERT INTO player_state (user_id, position_x, position_y, position_z, settings_json, keybindings_json, currency, stats_json)
  SELECT u.id, 8, 0, 8, '{"showDebugOverlay":false,"masterVolume":0.8}'::jsonb, '{"moveForward":"KeyW","moveBackward":"KeyS","moveLeft":"KeyA","moveRight":"KeyD"}'::jsonb, 0, '{"energy":100,"hydration":100}'::jsonb
  FROM users u WHERE u.username = 'ikiliki'
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO player_state (user_id, position_x, position_y, position_z, settings_json, keybindings_json, currency, stats_json)
  SELECT u.id, 8, 0, 8, '{"showDebugOverlay":false,"masterVolume":0.8}'::jsonb, '{"moveForward":"KeyW","moveBackward":"KeyS","moveLeft":"KeyA","moveRight":"KeyD"}'::jsonb, 0, '{"energy":100,"hydration":100}'::jsonb
  FROM users u WHERE u.username = 'ikiliki1'
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO discovered_chunks (chunk_x, chunk_y, biome, spawnable, discovered)
  VALUES (0, 0, 'grassland', true, true)
  ON CONFLICT (chunk_x, chunk_y) DO NOTHING;
END $$;

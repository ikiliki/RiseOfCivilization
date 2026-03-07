import type {
  Biome,
  DiscoveredChunkRecord,
  KeybindingMap,
  PlayerAssetLoadout,
  PlayerSettings,
  PlayerState,
  SkinInfo,
  Vec3,
  WorldMetadata
} from '@roc/shared-types';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
import { pool } from '../db/pool.js';
import { config } from '../config.js';
import { DEFAULT_KEYBINDINGS, DEFAULT_SETTINGS, DEFAULT_STATS, ORIGIN_SPAWN } from './defaults.js';

interface UserRow {
  id: string;
  username: string;
  skin_id: number | null;
}

interface SkinRow {
  id: number;
  name: string;
  color_hex: string;
}

interface PlayerStateRow {
  user_id: string;
  position_x: number;
  position_y: number;
  position_z: number;
  settings_json: PlayerSettings;
  keybindings_json: KeybindingMap;
  assets_json?: PlayerAssetLoadout | null;
  currency: number;
  stats_json: { energy: number; hydration: number };
}

export async function ensureWorldMetadata(): Promise<WorldMetadata> {
  const existing = await pool.query<WorldMetadata>(
    'SELECT id, world_seed AS "worldSeed", created_at AS "createdAt", updated_at AS "updatedAt" FROM world_metadata LIMIT 1'
  );
  if (existing.rowCount && existing.rows[0]) return existing.rows[0];

  const inserted = await pool.query<WorldMetadata>(
    `INSERT INTO world_metadata (world_seed)
     VALUES ($1)
     RETURNING id, world_seed AS "worldSeed", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [config.worldSeedDefault]
  );
  return inserted.rows[0];
}

export async function getRandomSkinId(): Promise<number> {
  const res = await pool.query<{ id: number }>(
    'SELECT id FROM skins ORDER BY RANDOM() LIMIT 1'
  );
  return res.rows[0]?.id ?? 1;
}

export async function getSkinById(skinId: number): Promise<SkinInfo | null> {
  const res = await pool.query<SkinRow>(
    'SELECT id, name, color_hex FROM skins WHERE id = $1',
    [skinId]
  );
  const row = res.rows[0];
  if (!row) return null;
  return { id: row.id, name: row.name, colorHex: row.color_hex };
}

export async function getSkinColorByUserId(userId: string): Promise<string | null> {
  const res = await pool.query<{ color_hex: string }>(
    `SELECT s.color_hex FROM users u JOIN skins s ON s.id = u.skin_id WHERE u.id = $1`,
    [userId]
  );
  return res.rows[0]?.color_hex ?? null;
}

export async function upsertUserByUsername(username: string): Promise<UserRow & { skinColor?: string }> {
  const existing = await pool.query<UserRow>(
    'SELECT id, username, skin_id FROM users WHERE username = $1',
    [username]
  );
  if (existing.rows[0]) {
    const user = existing.rows[0];
    const skin = user.skin_id ? await getSkinById(user.skin_id) : null;
    return { ...user, skinColor: skin?.colorHex };
  }
  const randomSkinId = await getRandomSkinId();
  const inserted = await pool.query<UserRow>(
    `INSERT INTO users (username, skin_id) VALUES ($1, $2) RETURNING id, username, skin_id`,
    [username, randomSkinId]
  );
  const user = inserted.rows[0];
  const skin = await getSkinById(randomSkinId);
  return { ...user, skinColor: skin?.colorHex };
}

function normalizeAssets(assets: PlayerAssetLoadout | null | undefined): PlayerAssetLoadout {
  if (!assets) return DEFAULT_PLAYER_ASSET_LOADOUT;
  return {
    hatAssetId: assets.hatAssetId || DEFAULT_PLAYER_ASSET_LOADOUT.hatAssetId,
    shoesAssetId: assets.shoesAssetId || DEFAULT_PLAYER_ASSET_LOADOUT.shoesAssetId,
    customAssetUrls: assets.customAssetUrls
  };
}

function normalizeKeybindings(keybindings: KeybindingMap | null | undefined): KeybindingMap {
  return {
    ...DEFAULT_KEYBINDINGS,
    ...(keybindings ?? {})
  };
}

export async function getPlayerState(userId: string, username: string): Promise<PlayerState | null> {
  const rowRes = await pool.query<PlayerStateRow & { skin_id: number | null }>(
    `SELECT ps.user_id, position_x, position_y, position_z, settings_json, keybindings_json, assets_json, currency, stats_json, u.skin_id
     FROM player_state ps
     JOIN users u ON u.id = ps.user_id
     WHERE ps.user_id = $1`,
    [userId]
  );
  const row = rowRes.rows[0];
  if (!row) return null;

  const skin = row.skin_id ? await getSkinById(row.skin_id) : null;

  return {
    userId,
    username,
    position: {
      x: row.position_x,
      y: row.position_y,
      z: row.position_z
    },
    settings: row.settings_json,
    keybindings: normalizeKeybindings(row.keybindings_json),
    assets: normalizeAssets(row.assets_json),
    currency: row.currency,
    stats: row.stats_json,
    skin: skin ?? undefined
  };
}

export async function ensurePlayerState(userId: string, username: string): Promise<PlayerState> {
  const existing = await getPlayerState(userId, username);
  if (existing) return existing;

  await pool.query(
    `INSERT INTO player_state (
      user_id, position_x, position_y, position_z, settings_json, keybindings_json, currency, stats_json
      , assets_json
    ) VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8::jsonb, $9::jsonb)`,
    [
      userId,
      ORIGIN_SPAWN.x,
      ORIGIN_SPAWN.y,
      ORIGIN_SPAWN.z,
      JSON.stringify(DEFAULT_SETTINGS),
      JSON.stringify(DEFAULT_KEYBINDINGS),
      0,
      JSON.stringify(DEFAULT_STATS),
      JSON.stringify(DEFAULT_PLAYER_ASSET_LOADOUT)
    ]
  );

  return {
    userId,
    username,
    position: ORIGIN_SPAWN,
    settings: DEFAULT_SETTINGS,
    keybindings: DEFAULT_KEYBINDINGS,
    assets: DEFAULT_PLAYER_ASSET_LOADOUT,
    currency: 0,
    stats: DEFAULT_STATS
  };
}

export async function savePlayerState(
  userId: string,
  position: Vec3,
  settings: PlayerSettings,
  keybindings: KeybindingMap,
  assets?: PlayerAssetLoadout
): Promise<void> {
  const normalizedAssets = normalizeAssets(assets);
  await pool.query(
    `UPDATE player_state
     SET position_x = $2,
         position_y = $3,
         position_z = $4,
         settings_json = $5::jsonb,
         keybindings_json = $6::jsonb,
         assets_json = $7::jsonb,
         updated_at = NOW()
     WHERE user_id = $1`,
    [
      userId,
      position.x,
      position.y,
      position.z,
      JSON.stringify(settings),
      JSON.stringify(keybindings),
      JSON.stringify(normalizedAssets)
    ]
  );
}

export async function getDiscoveredChunk(chunkX: number, chunkY: number): Promise<DiscoveredChunkRecord | null> {
  const result = await pool.query<DiscoveredChunkRecord>(
    `SELECT chunk_x AS "chunkX",
            chunk_y AS "chunkY",
            biome,
            spawnable,
            discovered,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
     FROM discovered_chunks
     WHERE chunk_x = $1 AND chunk_y = $2`,
    [chunkX, chunkY]
  );
  return result.rows[0] ?? null;
}

export async function upsertDiscoveredChunk(
  chunkX: number,
  chunkY: number,
  biome: Biome,
  spawnable: boolean
): Promise<void> {
  await pool.query(
    `INSERT INTO discovered_chunks (chunk_x, chunk_y, biome, spawnable, discovered)
     VALUES ($1, $2, $3, $4, true)
     ON CONFLICT (chunk_x, chunk_y)
     DO UPDATE SET biome = EXCLUDED.biome,
                   spawnable = EXCLUDED.spawnable,
                   discovered = true,
                   updated_at = NOW()`,
    [chunkX, chunkY, biome, spawnable]
  );
}

export async function listDiscoveredChunksInRange(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): Promise<DiscoveredChunkRecord[]> {
  const result = await pool.query<DiscoveredChunkRecord>(
    `SELECT chunk_x AS "chunkX",
            chunk_y AS "chunkY",
            biome,
            spawnable,
            discovered,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
     FROM discovered_chunks
     WHERE chunk_x BETWEEN $1 AND $2
       AND chunk_y BETWEEN $3 AND $4`,
    [minX, maxX, minY, maxY]
  );
  return result.rows;
}

interface PlayerStateByUserIdRow extends PlayerStateRow {
  username: string;
  skin_id: number | null;
}

export async function getPlayerStateByUserId(userId: string): Promise<PlayerState | null> {
  const rowRes = await pool.query<PlayerStateByUserIdRow>(
    `SELECT ps.user_id, u.username, position_x, position_y, position_z, settings_json, keybindings_json, assets_json, currency, stats_json, u.skin_id
     FROM player_state ps
     JOIN users u ON u.id = ps.user_id
     WHERE ps.user_id = $1`,
    [userId]
  );
  const row = rowRes.rows[0];
  if (!row) return null;

  const skin = row.skin_id ? await getSkinById(row.skin_id) : null;

  return {
    userId,
    username: row.username,
    position: {
      x: row.position_x,
      y: row.position_y,
      z: row.position_z
    },
    settings: row.settings_json,
    keybindings: normalizeKeybindings(row.keybindings_json),
    assets: normalizeAssets(row.assets_json),
    currency: row.currency,
    stats: row.stats_json,
    skin: skin ?? undefined
  };
}

export async function listSpawnableDiscoveredChunks(limit = 128): Promise<DiscoveredChunkRecord[]> {
  const result = await pool.query<DiscoveredChunkRecord>(
    `SELECT chunk_x AS "chunkX",
            chunk_y AS "chunkY",
            biome,
            spawnable,
            discovered,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
     FROM discovered_chunks
     WHERE discovered = true AND spawnable = true
     ORDER BY updated_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

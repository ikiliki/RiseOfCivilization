import type { Vec3 } from '@roc/shared-types';
import { generateChunk, getChunkSize } from '@roc/world-engine';
import { config } from '../config.js';
import { listSpawnableDiscoveredChunks, upsertDiscoveredChunk } from './repository.js';

/**
 * Resolves spawn position for new players. All new players spawn at the same
 * fixed point (center of chunk 0,0) so they can see each other immediately.
 */
export async function resolveSpawnPosition(): Promise<Vec3> {
  let candidates = await listSpawnableDiscoveredChunks();
  if (!candidates.length) {
    // MVP bootstrap fallback: discover one starter chunk so new players still
    // spawn in discovered territory while preserving shared-world rules.
    const bootstrap = generateChunk(config.worldSeedDefault, 0, 0);
    await upsertDiscoveredChunk(bootstrap.chunkX, bootstrap.chunkY, bootstrap.biome, bootstrap.spawnable);
    candidates = await listSpawnableDiscoveredChunks();
  }

  // Use a fixed spawn point (chunk 0,0 center) so all players see each other.
  const chunkSize = getChunkSize();
  return {
    x: chunkSize / 2,
    y: 0,
    z: chunkSize / 2
  };
}

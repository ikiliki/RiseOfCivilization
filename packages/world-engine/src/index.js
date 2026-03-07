const CHUNK_SIZE = 16;
function hashString(seed) {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}
function pseudoNoise(seed, x, y, scale) {
    const s = hashString(`${seed}:${Math.floor(x / scale)}:${Math.floor(y / scale)}`);
    const value = Math.sin(s * 0.000001 + x * 12.9898 + y * 78.233) * 43758.5453;
    return value - Math.floor(value);
}
export function getBiomeAt(seed, worldX, worldY) {
    const n = pseudoNoise(seed, worldX, worldY, 64);
    if (n < 0.33)
        return 'ice';
    if (n < 0.66)
        return 'grassland';
    return 'desert';
}
export function generateChunk(seed, chunkX, chunkY) {
    const startX = chunkX * CHUNK_SIZE;
    const startY = chunkY * CHUNK_SIZE;
    const tiles = [];
    let heightSum = 0;
    let spawnableCount = 0;
    const centerBiome = getBiomeAt(seed, startX + CHUNK_SIZE / 2, startY + CHUNK_SIZE / 2);
    for (let y = 0; y < CHUNK_SIZE; y += 1) {
        for (let x = 0; x < CHUNK_SIZE; x += 1) {
            const worldX = startX + x;
            const worldY = startY + y;
            const macroBiome = getBiomeAt(seed, worldX, worldY);
            const heightNoise = pseudoNoise(seed, worldX, worldY, 8);
            const height = Math.round((heightNoise * 2 - 1) * 10) / 10;
            const spawnable = height > -0.2 && height < 0.7;
            if (spawnable)
                spawnableCount += 1;
            heightSum += height;
            tiles.push({
                x: worldX,
                y: worldY,
                height,
                biome: macroBiome,
                spawnable
            });
        }
    }
    return {
        chunkX,
        chunkY,
        biome: centerBiome,
        averageHeight: heightSum / tiles.length,
        spawnable: spawnableCount > tiles.length * 0.2,
        tiles
    };
}
export function chunkKey(chunkX, chunkY) {
    return `${chunkX}:${chunkY}`;
}
export function worldToChunk(x, y) {
    return {
        chunkX: Math.floor(x / CHUNK_SIZE),
        chunkY: Math.floor(y / CHUNK_SIZE)
    };
}
export function getChunkSize() {
    return CHUNK_SIZE;
}

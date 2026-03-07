import { describe, expect, it } from 'vitest';
import { generateChunk, getBiomeAt } from '../src/index';

describe('world-engine deterministic generation', () => {
  it('returns identical chunk output for same seed and coords', () => {
    const first = generateChunk('mvp-seed', 2, -1);
    const second = generateChunk('mvp-seed', 2, -1);
    expect(second).toEqual(first);
  });

  it('changes output when coordinates change', () => {
    const a = generateChunk('mvp-seed', 0, 0);
    const b = generateChunk('mvp-seed', 1, 0);
    expect(a.averageHeight).not.toEqual(b.averageHeight);
  });

  it('maps biomes to one of the supported values', () => {
    const biome = getBiomeAt('mvp-seed', 40, 20);
    expect(['grassland', 'desert', 'ice']).toContain(biome);
  });
});

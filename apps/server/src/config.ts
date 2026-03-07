function toPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export const config = {
  port: Number(process.env.SERVER_PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/roc',
  authSecret: process.env.AUTH_TOKEN_SECRET || 'local-secret',
  worldSeedDefault: process.env.WORLD_SEED_DEFAULT || 'rise-of-civilization-mvp',
  displayName: process.env.SERVER_DISPLAY_NAME || 'Scania',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  presenceTtlSeconds: toPositiveInt(process.env.PRESENCE_TTL_SECONDS, 30),
  presenceHeartbeatSeconds: toPositiveInt(process.env.PRESENCE_HEARTBEAT_SECONDS, 10)
};

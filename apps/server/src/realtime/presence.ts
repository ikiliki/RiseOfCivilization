import type { PlayerAssetLoadout, PlayerPresence, Vec3 } from '@roc/shared-types';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
import { config } from '../config.js';
import { getRedisClient, getRedisSubscriberClient } from '../services/redis.js';

export interface PresenceEntry {
  connectionId: string;
  userId: string;
  username: string;
  serverId: string;
  realm: string;
  position: Vec3;
  direction?: { x: number; z: number };
  lastUpdatedAt: number;
  skinColor?: string;
  assets?: PlayerAssetLoadout;
}

export type PresenceEventType = 'join' | 'update' | 'leave' | 'kick';

export interface PresenceEvent {
  type: PresenceEventType;
  connectionId: string;
  userId: string;
  serverId: string;
  realm: string;
  timestamp: number;
  reason?: string;
}

const KEY_PREFIX = 'roc:presence';
const PRESENCE_EVENTS_CHANNEL = `${KEY_PREFIX}:events`;
const DEFAULT_NEARBY_RADIUS_METERS = 240;

function connectionKey(connectionId: string): string {
  return `${KEY_PREFIX}:conn:${connectionId}`;
}

function userKey(userId: string): string {
  return `${KEY_PREFIX}:user:${userId}`;
}

function serverKey(serverId: string, realm: string): string {
  return `${KEY_PREFIX}:server:${serverId}:realm:${realm}:connections`;
}

function serverGeoKey(serverId: string, realm: string): string {
  return `${KEY_PREFIX}:server:${serverId}:realm:${realm}:geo`;
}

function serverToken(serverId: string, realm: string): string {
  return `${serverId}|${realm}`;
}

function parseServerToken(token: string): { serverId: string; realm: string } {
  const [serverId, realm = 'default'] = token.split('|');
  return { serverId, realm };
}

function toNumber(value: string | undefined, fallback = 0): number {
  if (value == null) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseAssetLoadout(data: Record<string, string>): PlayerAssetLoadout {
  let customAssetUrls: PlayerAssetLoadout['customAssetUrls'];
  if (data.customAssetUrlsJson) {
    try {
      const parsed = JSON.parse(data.customAssetUrlsJson) as PlayerAssetLoadout['customAssetUrls'];
      customAssetUrls = parsed;
    } catch {
      customAssetUrls = undefined;
    }
  }

  return {
    hatAssetId: data.hatAssetId || DEFAULT_PLAYER_ASSET_LOADOUT.hatAssetId,
    shoesAssetId: data.shoesAssetId || DEFAULT_PLAYER_ASSET_LOADOUT.shoesAssetId,
    customAssetUrls
  };
}

function toPresenceEntry(connectionId: string, data: Record<string, string>): PresenceEntry | undefined {
  if (!data.userId || !data.username || !data.serverId || !data.realm) return undefined;
  return {
    connectionId,
    userId: data.userId,
    username: data.username,
    serverId: data.serverId,
    realm: data.realm,
    position: {
      x: toNumber(data.positionX),
      y: toNumber(data.positionY),
      z: toNumber(data.positionZ)
    },
    direction:
      data.directionX != null && data.directionZ != null
        ? { x: toNumber(data.directionX), z: toNumber(data.directionZ) }
        : undefined,
    lastUpdatedAt: toNumber(data.lastUpdatedAt, Date.now()),
    skinColor: data.skinColor,
    assets: parseAssetLoadout(data)
  };
}

async function removeConnectionFromIndexes(entry: PresenceEntry): Promise<void> {
  const redis = getRedisClient();
  const multi = redis.multi();
  multi.srem(serverKey(entry.serverId, entry.realm), entry.connectionId);
  multi.zrem(serverGeoKey(entry.serverId, entry.realm), entry.connectionId);
  multi.del(connectionKey(entry.connectionId));
  multi.del(userKey(entry.userId));
  await multi.exec();
}

export async function registerPresence(
  connectionId: string,
  userId: string,
  username: string,
  serverId: string,
  realm: string,
  position: Vec3,
  skinColor?: string,
  assets?: PlayerAssetLoadout
): Promise<void> {
  const redis = getRedisClient();
  const existingConnectionId = await redis.get(userKey(userId));
  if (existingConnectionId && existingConnectionId !== connectionId) {
    const staleData = await redis.hgetall(connectionKey(existingConnectionId));
    const staleEntry = toPresenceEntry(existingConnectionId, staleData);
    if (staleEntry) {
      await removeConnectionFromIndexes(staleEntry);
    } else {
      await redis.del(connectionKey(existingConnectionId));
    }
  }

  const now = Date.now();
  const connKey = connectionKey(connectionId);
  const ttlSeconds = config.presenceTtlSeconds;
  const multi = redis.multi();
  multi.hset(
    connKey,
    'connectionId',
    connectionId,
    'userId',
    userId,
    'username',
    username,
    'serverId',
    serverId,
    'realm',
    realm,
    'positionX',
    position.x.toString(),
    'positionY',
    position.y.toString(),
    'positionZ',
    position.z.toString(),
    'lastUpdatedAt',
    now.toString()
  );
  if (skinColor) {
    multi.hset(connKey, 'skinColor', skinColor);
  }
  const loadout = assets ?? DEFAULT_PLAYER_ASSET_LOADOUT;
  multi.hset(connKey, 'hatAssetId', loadout.hatAssetId, 'shoesAssetId', loadout.shoesAssetId);
  if (loadout.customAssetUrls) {
    multi.hset(connKey, 'customAssetUrlsJson', JSON.stringify(loadout.customAssetUrls));
  } else {
    multi.hdel(connKey, 'customAssetUrlsJson');
  }
  multi.expire(connKey, ttlSeconds);
  multi.set(userKey(userId), connectionId, 'EX', ttlSeconds);
  multi.sadd(serverKey(serverId, realm), connectionId);
  multi.geoadd(serverGeoKey(serverId, realm), position.x, position.z, connectionId);
  multi.sadd(`${KEY_PREFIX}:servers`, serverToken(serverId, realm));
  await multi.exec();
}

export async function updatePresence(
  connectionId: string,
  position: Vec3,
  direction?: { x: number; z: number }
): Promise<PresenceEntry | undefined> {
  const current = await getPresenceByConnection(connectionId);
  if (!current) return undefined;

  const redis = getRedisClient();
  const now = Date.now();
  const connKey = connectionKey(connectionId);
  const ttlSeconds = config.presenceTtlSeconds;
  const multi = redis.multi();
  multi.hset(
    connKey,
    'positionX',
    position.x.toString(),
    'positionY',
    position.y.toString(),
    'positionZ',
    position.z.toString(),
    'lastUpdatedAt',
    now.toString()
  );
  if (direction) {
    multi.hset(connKey, 'directionX', direction.x.toString(), 'directionZ', direction.z.toString());
  } else {
    multi.hdel(connKey, 'directionX', 'directionZ');
  }
  multi.expire(connKey, ttlSeconds);
  multi.expire(userKey(current.userId), ttlSeconds);
  multi.geoadd(serverGeoKey(current.serverId, current.realm), position.x, position.z, connectionId);
  await multi.exec();

  return {
    ...current,
    position,
    direction,
    lastUpdatedAt: now
  };
}

export async function updatePresenceAssets(
  connectionId: string,
  assets: PlayerAssetLoadout
): Promise<PresenceEntry | undefined> {
  const current = await getPresenceByConnection(connectionId);
  if (!current) return undefined;
  const redis = getRedisClient();
  const connKey = connectionKey(connectionId);
  const ttlSeconds = config.presenceTtlSeconds;
  const loadout = {
    hatAssetId: assets.hatAssetId || DEFAULT_PLAYER_ASSET_LOADOUT.hatAssetId,
    shoesAssetId: assets.shoesAssetId || DEFAULT_PLAYER_ASSET_LOADOUT.shoesAssetId,
    customAssetUrls: assets.customAssetUrls
  };
  const multi = redis.multi();
  multi.hset(connKey, 'hatAssetId', loadout.hatAssetId, 'shoesAssetId', loadout.shoesAssetId);
  if (loadout.customAssetUrls) {
    multi.hset(connKey, 'customAssetUrlsJson', JSON.stringify(loadout.customAssetUrls));
  } else {
    multi.hdel(connKey, 'customAssetUrlsJson');
  }
  multi.expire(connKey, ttlSeconds);
  await multi.exec();
  return {
    ...current,
    assets: loadout
  };
}

export async function heartbeatPresence(connectionId: string): Promise<void> {
  const current = await getPresenceByConnection(connectionId);
  if (!current) return;
  const redis = getRedisClient();
  const ttlSeconds = config.presenceTtlSeconds;
  const multi = redis.multi();
  multi.expire(connectionKey(connectionId), ttlSeconds);
  multi.expire(userKey(current.userId), ttlSeconds);
  await multi.exec();
}

export async function removePresence(connectionId: string): Promise<PresenceEntry | undefined> {
  const current = await getPresenceByConnection(connectionId);
  if (!current) return undefined;
  await removeConnectionFromIndexes(current);
  return current;
}

export async function getPresenceByConnection(connectionId: string): Promise<PresenceEntry | undefined> {
  const redis = getRedisClient();
  const result = await redis.hgetall(connectionKey(connectionId));
  if (!result || Object.keys(result).length === 0) return undefined;
  return toPresenceEntry(connectionId, result);
}

export async function getPresenceByUserId(
  userId: string,
  opts?: { serverId?: string; realm?: string }
): Promise<PresenceEntry | undefined> {
  const redis = getRedisClient();
  const connectionId = await redis.get(userKey(userId));
  if (!connectionId) return undefined;
  const entry = await getPresenceByConnection(connectionId);
  if (!entry) {
    await redis.del(userKey(userId));
    return undefined;
  }
  if (opts?.serverId && entry.serverId !== opts.serverId) return undefined;
  if (opts?.realm && entry.realm !== opts.realm) return undefined;
  return entry;
}

async function readActivePresenceEntries(
  serverId: string,
  realm: string
): Promise<{ entries: PresenceEntry[]; staleConnectionIds: string[] }> {
  const redis = getRedisClient();
  const connectionIds = await redis.smembers(serverKey(serverId, realm));
  if (connectionIds.length === 0) {
    return { entries: [], staleConnectionIds: [] };
  }

  const pipeline = redis.pipeline();
  for (const connectionId of connectionIds) {
    pipeline.hgetall(connectionKey(connectionId));
  }
  const rows = await pipeline.exec();
  const entries: PresenceEntry[] = [];
  const staleConnectionIds: string[] = [];

  rows?.forEach((row, index) => {
    const data = row?.[1] as Record<string, string> | null;
    const connectionId = connectionIds[index];
    if (!data || Object.keys(data).length === 0) {
      staleConnectionIds.push(connectionId);
      return;
    }
    const entry = toPresenceEntry(connectionId, data);
    if (entry) {
      entries.push(entry);
      return;
    }
    staleConnectionIds.push(connectionId);
  });

  if (staleConnectionIds.length > 0) {
    await redis.srem(serverKey(serverId, realm), ...staleConnectionIds);
    await redis.zrem(serverGeoKey(serverId, realm), ...staleConnectionIds);
  }

  return { entries, staleConnectionIds };
}

export async function listOnlineByServer(
  serverId: string,
  realm = 'default'
): Promise<PresenceEntry[]> {
  const { entries } = await readActivePresenceEntries(serverId, realm);
  return entries;
}

export async function listOnlineServers(): Promise<
  Array<{ serverId: string; realm: string; onlineCount: number }>
> {
  const redis = getRedisClient();
  const tokens = await redis.smembers(`${KEY_PREFIX}:servers`);
  if (tokens.length === 0) return [];

  const results: Array<{ serverId: string; realm: string; onlineCount: number }> = [];
  for (const token of tokens) {
    const { serverId, realm } = parseServerToken(token);
    const entries = await listOnlineByServer(serverId, realm);
    if (entries.length > 0) {
      results.push({ serverId, realm, onlineCount: entries.length });
    } else {
      await redis.srem(`${KEY_PREFIX}:servers`, token);
    }
  }
  return results;
}

export async function getNearbyByServer(
  serverId: string,
  realm: string,
  sourcePosition: Vec3,
  radiusMeters = DEFAULT_NEARBY_RADIUS_METERS
): Promise<PresenceEntry[]> {
  const redis = getRedisClient();
  const geoMembers = await redis.georadius(
    serverGeoKey(serverId, realm),
    sourcePosition.x,
    sourcePosition.z,
    radiusMeters,
    'm'
  );
  const connectionIds = geoMembers.map((member) => String(member));
  if (connectionIds.length === 0) return [];

  const pipeline = redis.pipeline();
  for (const connectionId of connectionIds) {
    pipeline.hgetall(connectionKey(connectionId));
  }
  const rows = await pipeline.exec();
  const entries: PresenceEntry[] = [];
  rows?.forEach((row, index) => {
    const data = row?.[1] as Record<string, string> | null;
    const connectionId = connectionIds[index];
    if (!data || Object.keys(data).length === 0) return;
    const entry = toPresenceEntry(connectionId, data);
    if (entry) entries.push(entry);
  });
  return entries;
}

export function toPresencePayload(entry: PresenceEntry): PlayerPresence {
  return {
    userId: entry.userId,
    username: entry.username,
    position: entry.position,
    direction: entry.direction,
    lastUpdatedAt: entry.lastUpdatedAt,
    skinColor: entry.skinColor,
    assets: entry.assets ?? DEFAULT_PLAYER_ASSET_LOADOUT
  };
}

export async function publishPresenceEvent(event: PresenceEvent): Promise<void> {
  const redis = getRedisClient();
  await redis.publish(PRESENCE_EVENTS_CHANNEL, JSON.stringify(event));
}

export async function subscribePresenceEvents(
  onEvent: (event: PresenceEvent) => Promise<void> | void
): Promise<() => Promise<void>> {
  const subscriber = getRedisSubscriberClient();
  await subscriber.subscribe(PRESENCE_EVENTS_CHANNEL);

  const listener = async (channel: string, message: string): Promise<void> => {
    if (channel !== PRESENCE_EVENTS_CHANNEL) return;
    try {
      const event = JSON.parse(message) as PresenceEvent;
      await onEvent(event);
    } catch {
      return;
    }
  };
  subscriber.on('message', listener);

  return async () => {
    subscriber.off('message', listener);
    await subscriber.unsubscribe(PRESENCE_EVENTS_CHANNEL);
  };
}

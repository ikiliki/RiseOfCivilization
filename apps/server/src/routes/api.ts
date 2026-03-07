import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { ChunkDiscoverRequest, LoginRequest, SavePlayerRequest } from '@roc/shared-types';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config.js';
import { getBiomeAt, worldToChunk } from '@roc/world-engine';
import { ensurePlayerState, ensureWorldMetadata, getPlayerState, getPlayerStateByUserId, listDiscoveredChunksInRange, savePlayerState, upsertDiscoveredChunk, upsertUserByUsername } from '../services/repository.js';
import { signSession, verifySession } from '../services/auth.js';
import { resolveSpawnPosition } from '../services/spawn.js';
import {
  getPresenceByUserId,
  listOnlineByServer,
  listOnlineServers,
  publishPresenceEvent,
  toPresencePayload,
  updatePresenceAssets
} from '../realtime/presence.js';

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: string;
    username: string;
  };
}

const loginSchema = z.object({
  username: z.string().min(2).max(24)
});

const discoverSchema = z.object({
  chunkX: z.number().int(),
  chunkY: z.number().int(),
  biome: z.enum(['grassland', 'desert', 'ice']),
  spawnable: z.boolean()
});

const saveSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number()
  }),
  settings: z.object({
    showDebugOverlay: z.boolean(),
    masterVolume: z.number().min(0).max(1)
  }),
  keybindings: z.object({
    moveForward: z.string(),
    moveBackward: z.string(),
    moveLeft: z.string(),
    moveRight: z.string(),
    toggleEquipment: z.string(),
    toggleItems: z.string(),
    toggleSettings: z.string()
  }),
  assets: z
    .object({
      hatAssetId: z.string().min(1),
      shoesAssetId: z.string().min(1),
      customAssetUrls: z
        .object({
          hat: z.string().url().optional(),
          shoes: z.string().url().optional()
        })
        .optional()
    })
    .optional()
});

const presenceOnlineQuerySchema = z.object({
  serverId: z.string().min(1),
  realm: z.string().min(1).optional()
});

const presencePlayerQuerySchema = z.object({
  serverId: z.string().min(1).optional(),
  realm: z.string().min(1).optional()
});

const adminRemoveUserSchema = z.object({
  userId: z.string().min(1),
  realm: z.string().min(1).optional()
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminDir = path.resolve(__dirname, '../admin');
const rootPortalFile = path.resolve(__dirname, '../../../../root.html');

async function authGuard(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
  const auth = request.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Unauthorized' });
    return;
  }
  try {
    const token = auth.replace('Bearer ', '');
    request.user = verifySession(token);
  } catch {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}

export async function registerApiRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({ ok: true }));

  app.get('/', async (_, reply) => {
    const html = await readFile(rootPortalFile, 'utf8');
    reply.type('text/html; charset=utf-8').send(html);
  });

  app.get('/admin', async (_, reply) => {
    const html = await readFile(path.join(adminDir, 'index.html'), 'utf8');
    reply.type('text/html; charset=utf-8').send(html);
  });

  app.get('/admin/app.js', async (_, reply) => {
    const js = await readFile(path.join(adminDir, 'app.js'), 'utf8');
    reply.type('text/javascript; charset=utf-8').send(js);
  });

  app.get('/api/server/info', async () => ({
    displayName: config.displayName
  }));

  app.get<{ Querystring: { realm?: string } }>('/api/admin/live-users', async (request) => {
    const realm = request.query.realm?.trim() || 'default';
    const entries = await listOnlineByServer(config.displayName, realm);
    return {
      serverId: config.displayName,
      realm,
      onlineCount: entries.length,
      generatedAt: Date.now(),
      players: entries.map(toPresencePayload)
    };
  });

  app.post<{ Body: { userId: string; realm?: string } }>('/api/admin/remove-user', async (request, reply) => {
    const parsed = adminRemoveUserSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }
    const realm = parsed.data.realm?.trim() || 'default';
    await publishPresenceEvent({
      type: 'kick',
      connectionId: '',
      userId: parsed.data.userId,
      serverId: config.displayName,
      realm,
      timestamp: Date.now(),
      reason: 'Removed by admin'
    });
    return {
      ok: true,
      userId: parsed.data.userId,
      serverId: config.displayName,
      realm
    };
  });

  app.get<{ Querystring: { serverId?: string; realm?: string } }>(
    '/api/server/live-players',
    { preHandler: authGuard },
    async (request, reply) => {
      const serverId = request.query.serverId ?? config.displayName;
      const realm = request.query.realm ?? 'default';
      const parsed = presenceOnlineQuerySchema.safeParse({ serverId, realm });
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }
      const entries = await listOnlineByServer(parsed.data.serverId, parsed.data.realm ?? 'default');
      return {
        serverId: parsed.data.serverId,
        realm: parsed.data.realm ?? 'default',
        onlineCount: entries.length,
        players: entries.map(toPresencePayload)
      };
    }
  );

  app.get('/api/presence/servers', { preHandler: authGuard }, async () => {
    const servers = await listOnlineServers();
    return { servers };
  });

  app.get<{ Querystring: { serverId?: string; realm?: string } }>(
    '/api/presence/online',
    { preHandler: authGuard },
    async (request, reply) => {
      const parsed = presenceOnlineQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }
      const serverId = parsed.data.serverId;
      const realm = parsed.data.realm ?? 'default';
      const entries = await listOnlineByServer(serverId, realm);
      return {
        serverId,
        realm,
        onlineCount: entries.length,
        players: entries.map(toPresencePayload)
      };
    }
  );

  app.get<{ Params: { userId: string }; Querystring: { serverId?: string; realm?: string } }>(
    '/api/presence/player/:userId',
    { preHandler: authGuard },
    async (request, reply) => {
      const parsed = presencePlayerQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }
      const entry = await getPresenceByUserId(request.params.userId, {
        serverId: parsed.data.serverId,
        realm: parsed.data.realm
      });
      if (!entry) {
        return reply.status(404).send({ error: 'Player not online' });
      }
      return {
        player: toPresencePayload(entry),
        serverId: entry.serverId,
        realm: entry.realm
      };
    }
  );

  app.post<{ Body: LoginRequest }>('/api/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }
    const username = parsed.data.username.trim().toLowerCase();
    const user = await upsertUserByUsername(username);
    await ensurePlayerState(user.id, user.username);
    const token = signSession({ userId: user.id, username: user.username });
    return {
      token,
      userId: user.id,
      username: user.username,
      serverDisplayName: config.displayName
    };
  });

  app.get('/api/bootstrap', { preHandler: authGuard }, async (request: AuthenticatedRequest) => {
    const world = await ensureWorldMetadata();
    const user = request.user!;
    let player = await getPlayerState(user.userId, user.username);
    if (!player) {
      player = await ensurePlayerState(user.userId, user.username);
    }

    const isAtOrigin = player.position.x === 0 && player.position.z === 0;
    const spawn = isAtOrigin ? await resolveSpawnPosition() : player.position;
    if (isAtOrigin) {
      await savePlayerState(user.userId, spawn, player.settings, player.keybindings);
      player.position = spawn;
    }
    return { world, player, spawn, serverDisplayName: config.displayName };
  });

  app.get('/api/world/metadata', { preHandler: authGuard }, async () => {
    const world = await ensureWorldMetadata();
    return { world };
  });

  app.post<{ Body: ChunkDiscoverRequest }>(
    '/api/chunks/discover',
    { preHandler: authGuard },
    async (request, reply) => {
      const parsed = discoverSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }
      const payload = parsed.data;
      await upsertDiscoveredChunk(payload.chunkX, payload.chunkY, payload.biome, payload.spawnable);
      return { ok: true };
    }
  );

  app.get<{ Querystring: { minX: string; maxX: string; minY: string; maxY: string } }>(
    '/api/chunks/discovered',
    { preHandler: authGuard },
    async (request) => {
      const minX = Number(request.query.minX);
      const maxX = Number(request.query.maxX);
      const minY = Number(request.query.minY);
      const maxY = Number(request.query.maxY);
      const chunks = await listDiscoveredChunksInRange(minX, maxX, minY, maxY);
      return { chunks };
    }
  );

  app.post<{ Body: SavePlayerRequest }>(
    '/api/player/save',
    { preHandler: authGuard },
    async (request, reply) => {
      const parsed = saveSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }
      const user = (request as AuthenticatedRequest).user!;
      await savePlayerState(
        user.userId,
        parsed.data.position,
        parsed.data.settings,
        parsed.data.keybindings,
        parsed.data.assets
      );
      if (parsed.data.assets) {
        const presence = await getPresenceByUserId(user.userId);
        if (presence) {
          await updatePresenceAssets(presence.connectionId, parsed.data.assets);
          await publishPresenceEvent({
            type: 'update',
            connectionId: presence.connectionId,
            userId: presence.userId,
            serverId: presence.serverId,
            realm: presence.realm,
            timestamp: Date.now()
          });
        }
      }
      return { ok: true };
    }
  );

  app.get<{ Params: { userId: string } }>(
    '/api/player/:userId/inspect',
    { preHandler: authGuard },
    async (request, reply) => {
      const { userId } = request.params;
      const presence = await getPresenceByUserId(userId);
      const player = await getPlayerStateByUserId(userId);
      if (!player && !presence) {
        return reply.status(404).send({ error: 'Player not found' });
      }
      const pos = presence?.position ?? player!.position;
      const { chunkX, chunkY } = worldToChunk(pos.x, pos.z);
      const world = await ensureWorldMetadata();
      const biome = getBiomeAt(world.worldSeed, pos.x, pos.z);
      const skinColor = player?.skin?.colorHex ?? presence?.skinColor;
      return {
        userId: player?.userId ?? presence!.userId,
        username: player?.username ?? presence!.username,
        position: pos,
        currency: player?.currency ?? 0,
        stats: player?.stats ?? { energy: 100, hydration: 100 },
        chunkX,
        chunkY,
        biome,
        skinColor,
        assets: player?.assets ?? presence?.assets
      };
    }
  );
}

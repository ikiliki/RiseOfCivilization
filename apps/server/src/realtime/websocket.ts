/**
 * WebSocket handler for multiplayer presence and position sync.
 * Presence state is stored in Redis and fan-out is coordinated over Redis pub/sub.
 */

import type { FastifyInstance } from 'fastify';
import type { Vec3 } from '@roc/shared-types';
import { config } from '../config.js';
import { getPlayerStateByUserId, getSkinColorByUserId } from '../services/repository.js';
import { verifySession } from '../services/auth.js';
import {
  heartbeatPresence,
  listOnlineByServer,
  publishPresenceEvent,
  registerPresence,
  removePresence,
  subscribePresenceEvents,
  toPresencePayload,
  updatePresence
} from './presence.js';

const WS_PATH = '/ws';
const LOG_PREFIX = '[WS]';

interface LocalConnection {
  serverId: string;
  realm: string;
  userId: string;
  username: string;
  send: (data: string) => void;
  getReadyState: () => number;
  close: (code?: number, reason?: string) => void;
}

const connections = new Map<string, LocalConnection>();
const positionLogCount = new Map<string, number>();
const heartbeatTimers = new Map<string, NodeJS.Timeout>();

interface PositionMessage {
  type: 'position_update';
  position: Vec3;
  direction?: { x: number; z: number };
}

interface ChatMessage {
  type: 'chat_message';
  text: string;
}

function parseMessage(data: Buffer | string): unknown {
  try {
    const text = typeof data === 'string' ? data : data.toString('utf8');
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function broadcastToServer(serverId: string, realm: string, payload: object): void {
  const json = JSON.stringify(payload);
  for (const [, conn] of connections) {
    if (conn.serverId !== serverId || conn.realm !== realm) continue;
    if (conn.getReadyState() === 1) conn.send(json);
  }
}

function closeReplacedUserConnections(
  connectionId: string,
  serverId: string,
  realm: string,
  userId: string
): void {
  for (const [existingConnId, conn] of connections) {
    if (existingConnId === connectionId) continue;
    if (conn.serverId !== serverId || conn.realm !== realm || conn.userId !== userId) continue;
    try {
      conn.send(
        JSON.stringify({
          type: 'forced_logout',
          reason: 'Session replaced by newer connection'
        })
      );
    } catch {
      // ignore send errors during replacement
    }
    conn.close(4005, 'Session replaced');
  }
}

function forceDisconnectUser(serverId: string, realm: string, userId: string, reason = 'Removed by admin'): void {
  for (const [, conn] of connections) {
    if (conn.serverId !== serverId || conn.realm !== realm || conn.userId !== userId) continue;
    if (conn.getReadyState() === 1) {
      conn.send(
        JSON.stringify({
          type: 'forced_logout',
          reason
        })
      );
    }
    conn.close(4004, reason);
  }
}

async function broadcastPresenceSnapshot(serverId: string, realm: string): Promise<number> {
  const entries = await listOnlineByServer(serverId, realm);
  const players = entries.map(toPresencePayload);
  const onlineCount = players.length;
  broadcastToServer(serverId, realm, {
    type: 'presence_update' as const,
    players,
    onlineCount
  });
  return onlineCount;
}

export async function registerWebSocket(app: FastifyInstance): Promise<void> {
  const { default: fastifyWebsocket } = await import('@fastify/websocket');
  await app.register(fastifyWebsocket);

  const unsubscribePresenceEvents = await subscribePresenceEvents(async (event) => {
    if (event.type === 'kick') {
      forceDisconnectUser(event.serverId, event.realm, event.userId, event.reason);
      return;
    }
    if (event.type === 'leave') {
      broadcastToServer(event.serverId, event.realm, {
        type: 'presence_leave' as const,
        userId: event.userId
      });
    }
    const onlineCount = await broadcastPresenceSnapshot(event.serverId, event.realm);
    if (event.type === 'join' || event.type === 'leave') {
      broadcastToServer(event.serverId, event.realm, {
        type: 'online_count' as const,
        count: onlineCount
      });
    }
  });

  app.get(WS_PATH, { websocket: true }, async (socket, request) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const token = url.searchParams.get('token');
    if (!token) {
      socket.close(4001, 'Missing token');
      return;
    }

    let userId: string;
    let username: string;
    try {
      const payload = verifySession(token);
      userId = payload.userId;
      username = payload.username;
    } catch {
      socket.close(4002, 'Invalid token');
      return;
    }

    const serverId = (url.searchParams.get('serverId') || config.displayName).trim() || config.displayName;
    const realm = (url.searchParams.get('realm') || 'default').trim() || 'default';
    const connectionId = `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    connections.set(connectionId, {
      serverId,
      realm,
      userId,
      username,
      send: (data: string) => socket.send(data),
      getReadyState: () => socket.readyState,
      close: (code?: number, reason?: string) => socket.close(code, reason)
    });
    closeReplacedUserConnections(connectionId, serverId, realm, userId);

    const skinColor = await getSkinColorByUserId(userId);
    const playerState = await getPlayerStateByUserId(userId);
    await registerPresence(
      connectionId,
      userId,
      username,
      serverId,
      realm,
      { x: 0, y: 0, z: 0 },
      skinColor ?? undefined,
      playerState?.assets
    );
    await publishPresenceEvent({
      type: 'join',
      connectionId,
      userId,
      serverId,
      realm,
      timestamp: Date.now()
    });
    console.log(
      `${LOG_PREFIX} connect conn=${connectionId} userId=${userId} username=${username} serverId=${serverId} realm=${realm}`
    );

    const heartbeatInterval = setInterval(() => {
      void heartbeatPresence(connectionId);
    }, config.presenceHeartbeatSeconds * 1000);
    heartbeatTimers.set(connectionId, heartbeatInterval);

    socket.on('message', (raw: Buffer | string) => {
      const local = connections.get(connectionId);
      if (!local) return;
      const msg = parseMessage(raw) as PositionMessage | ChatMessage | null;
      if (!msg) return;

      if (msg.type === 'chat_message') {
        const text = typeof msg.text === 'string' ? msg.text.trim().slice(0, 500) : '';
        if (text) {
          const chatPayload = {
            type: 'chat_message' as const,
            userId,
            username,
            text,
            timestamp: Date.now()
          };
          broadcastToServer(local.serverId, local.realm, chatPayload);
          console.log(`${LOG_PREFIX} chat ${username}: ${text.slice(0, 50)}`);
        }
        return;
      }

      if (msg.type !== 'position_update') return;
      const { position, direction } = msg;
      if (typeof position?.x !== 'number' || typeof position?.z !== 'number') return;

      void updatePresence(connectionId, { x: position.x, y: position.y ?? 0, z: position.z }, direction).then(
        async (updated) => {
          if (!updated) return;
          await publishPresenceEvent({
            type: 'update',
            connectionId,
            userId: updated.userId,
            serverId: updated.serverId,
            realm: updated.realm,
            timestamp: Date.now()
          });
        }
      );
      const n = (positionLogCount.get(connectionId) ?? 0) + 1;
      positionLogCount.set(connectionId, n);
      if (n % 30 === 1) {
        console.log(
          `${LOG_PREFIX} position_update conn=${connectionId} pos=(${position.x.toFixed(1)},${position.z.toFixed(1)})`
        );
      }
    });

    let disconnected = false;
    const handleDisconnect = () => {
      if (disconnected) return;
      disconnected = true;
      const timer = heartbeatTimers.get(connectionId);
      if (timer) {
        clearInterval(timer);
        heartbeatTimers.delete(connectionId);
      }
      connections.delete(connectionId);
      positionLogCount.delete(connectionId);
      void removePresence(connectionId).then(async (entry) => {
        console.log(
          `${LOG_PREFIX} disconnect conn=${connectionId} userId=${entry?.userId} username=${entry?.username}`
        );
        if (!entry) {
          return;
        }
        await publishPresenceEvent({
          type: 'leave',
          connectionId,
          userId: entry.userId,
          serverId: entry.serverId,
          realm: entry.realm,
          timestamp: Date.now()
        });
      });
    };

    socket.on('close', handleDisconnect);
    socket.on('error', (err: unknown) => {
      console.log(`${LOG_PREFIX} error conn=${connectionId}`, err);
      handleDisconnect();
    });
  });

  app.addHook('onClose', async () => {
    for (const [, timer] of heartbeatTimers) {
      clearInterval(timer);
    }
    heartbeatTimers.clear();
    await unsubscribePresenceEvents();
  });
}

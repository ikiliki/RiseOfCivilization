/**
 * Phase 2: Multiplayer presence hook.
 * Connects to WebSocket, sends position updates, receives nearby player presence.
 *
 * Architecture: Ref-based position store for live updates.
 * - remotePlayersMapRef: Updated synchronously on every presence_update.
 *   useFrame reads from this ref every frame, bypassing React's render cycle.
 * - remotePlayerIds: Only changes when players join/leave; triggers re-render for mesh list.
 * This ensures remote player positions update live without React batching delays.
 */

import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlayerPresence, Vec3 } from '@roc/shared-types';
import { getApiBase } from '../lib/serverStore';
import type { SocketLogEntry } from '@roc/ui';

export interface ChatEntry {
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

/** Match server tick (~60fps) for live position sync. */
const POSITION_UPDATE_INTERVAL_MS = 16;
const LOG_PREFIX = '[WS]';
const RECONNECT_BASE_DELAY_MS = 500;
const RECONNECT_MAX_DELAY_MS = 5000;

function getWsUrl(token: string): string {
  const base = getApiBase();
  const wsBase = base.replace(/^http/, 'ws');
  return `${wsBase}/ws?token=${encodeURIComponent(token)}`;
}

export interface UseMultiplayerOptions {
  token: string;
  localUserId: string;
  positionRef: RefObject<Vec3>;
  directionRef?: RefObject<{ x: number; z: number } | undefined>;
  enabled?: boolean;
  onForcedLogout?: (reason?: string) => void;
}

export interface UseMultiplayerResult {
  /** Ref containing latest presence data. Read in useFrame for live updates. */
  remotePlayersMapRef: RefObject<Map<string, PlayerPresence>>;
  /** User IDs of nearby players. Use for rendering; triggers re-render on join/leave. */
  remotePlayerIds: string[];
  connected: boolean;
  /** Number of players currently online. Updates live. */
  onlineCount: number;
  /** Chat messages. Updates live. */
  chatMessages: ChatEntry[];
  /** Send a chat message. */
  sendChat: (text: string) => boolean;
  /** Explicitly close websocket connection. */
  disconnect: () => void;
  /** Debug counters + logs for developer mode panel. */
  sentUpdates: number;
  receivedUpdates: number;
  socketLogs: SocketLogEntry[];
}

export function useMultiplayer({
  token,
  localUserId,
  positionRef,
  directionRef,
  enabled = true,
  onForcedLogout
}: UseMultiplayerOptions): UseMultiplayerResult {
  const remotePlayersMapRef = useRef<Map<string, PlayerPresence>>(new Map());
  const remotePlayerIdsRef = useRef<string[]>([]);
  const localUserIdRef = useRef(localUserId);
  const [remotePlayerIds, setRemotePlayerIds] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatEntry[]>([]);
  const [sentUpdates, setSentUpdates] = useState(0);
  const [receivedUpdates, setReceivedUpdates] = useState(0);
  const [socketLogs, setSocketLogs] = useState<SocketLogEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptRef = useRef(0);
  const connectRef = useRef<(() => void) | null>(null);
  const presenceLogCountRef = useRef(0);
  const sentLogCountRef = useRef(0);
  const chatMaxRef = useRef(100);
  const socketLogMaxRef = useRef(80);
  const logIdRef = useRef(0);
  const onForcedLogoutRef = useRef(onForcedLogout);
  const intentionalCloseRef = useRef(false);
  const lastSentRef = useRef<{
    x: number;
    y: number;
    z: number;
    dx: number;
    dz: number;
  } | null>(null);

  localUserIdRef.current = localUserId;
  onForcedLogoutRef.current = onForcedLogout;

  const pushSocketLog = useCallback((kind: SocketLogEntry['kind'], message: string) => {
    const nextId = ++logIdRef.current;
    setSocketLogs((prev) =>
      [...prev, { id: nextId, timestamp: Date.now(), kind, message }].slice(-socketLogMaxRef.current)
    );
  }, []);

  const sendChat = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'chat_message', text: trimmed }));
      setSentUpdates((n) => n + 1);
      pushSocketLog('send', `chat_message ${trimmed.slice(0, 64)}`);
      return true;
    }
    // Best-effort self-heal if socket dropped and user sends chat.
    connectRef.current?.();
    pushSocketLog('error', 'chat send skipped: socket not open');
    return false;
  }, [pushSocketLog]);

  const disconnect = useCallback(() => {
    const ws = wsRef.current;
    if (ws) {
      intentionalCloseRef.current = true;
      try {
        ws.close(1000, 'Client logout');
      } catch {
        ws.close();
      }
    }
  }, []);

  const sendPositionIfChanged = useCallback(
    () => {
      const ws = wsRef.current;
      if (ws?.readyState !== WebSocket.OPEN) return;
      const pos = positionRef.current;
      if (!pos || !('x' in pos)) return;
      const dir = directionRef?.current;
      const next = {
        x: pos.x,
        y: pos.y ?? 0,
        z: pos.z,
        dx: dir?.x ?? 0,
        dz: dir?.z ?? 0
      };

      ws.send(JSON.stringify({
        type: 'position_update',
        position: { x: next.x, y: next.y, z: next.z },
        direction: { x: next.dx, z: next.dz }
      }));
      lastSentRef.current = next;
      setSentUpdates((n) => n + 1);
      sentLogCountRef.current++;
      if (sentLogCountRef.current % 15 === 1) {
        pushSocketLog('send', `position_update x=${next.x.toFixed(1)} z=${next.z.toFixed(1)}`);
      }
    },
    [directionRef, positionRef, pushSocketLog]
  );

  useEffect(() => {
    if (!enabled || !token) return;

    const connect = () => {
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)
      ) {
        return;
      }
      const url = getWsUrl(token);
      console.log(`${LOG_PREFIX} connect url=${url}`);
      const ws = new WebSocket(url);
      wsRef.current = ws;
      intentionalCloseRef.current = false;

      ws.onopen = () => {
        if (wsRef.current !== ws) return;
        setConnected(true);
        reconnectAttemptRef.current = 0;
        if (reconnectTimerRef.current != null) {
          window.clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
        console.log(`${LOG_PREFIX} open`);
        pushSocketLog('connect', 'socket open');
        sendPositionIfChanged();
      };

      ws.onmessage = (event) => {
        if (wsRef.current !== ws) return;
        try {
          const msg = JSON.parse(event.data as string) as
            | { type: 'presence_update'; players: PlayerPresence[]; onlineCount?: number }
            | { type: 'presence_leave'; userId: string }
            | { type: 'chat_message'; userId: string; username: string; text: string; timestamp: number }
            | { type: 'online_count'; count: number }
            | { type: 'forced_logout'; reason?: string };

          if (msg.type === 'forced_logout') {
            console.log(`${LOG_PREFIX} forced_logout reason=${msg.reason ?? 'n/a'}`);
            pushSocketLog('close', `forced_logout ${msg.reason ?? ''}`.trim());
            intentionalCloseRef.current = true;
            ws.close(4004, msg.reason ?? 'Forced logout');
            onForcedLogoutRef.current?.(msg.reason);
            return;
          }

          if (msg.type === 'online_count') {
            setOnlineCount(msg.count);
            setReceivedUpdates((n) => n + 1);
            pushSocketLog('receive', `online_count ${msg.count}`);
            return;
          }

          if (msg.type === 'chat_message') {
            setReceivedUpdates((n) => n + 1);
            pushSocketLog('receive', `chat ${msg.username}: ${msg.text.slice(0, 32)}`);
            setChatMessages((prev) => {
              const next = [...prev, { userId: msg.userId, username: msg.username, text: msg.text, timestamp: msg.timestamp }];
              return next.slice(-chatMaxRef.current);
            });
            return;
          }

          if (msg.type === 'presence_leave') {
            console.log(`${LOG_PREFIX} presence_leave received userId=${msg.userId}`);
            setReceivedUpdates((n) => n + 1);
            pushSocketLog('receive', `presence_leave ${msg.userId}`);
            const nextMap = new Map(remotePlayersMapRef.current);
            nextMap.delete(msg.userId);
            remotePlayersMapRef.current = nextMap;
            const nextIds = [...nextMap.keys()];
            remotePlayerIdsRef.current = nextIds;
            setRemotePlayerIds(nextIds);
            return;
          }

          if (msg.type !== 'presence_update' || !Array.isArray(msg.players)) return;
          setReceivedUpdates((n) => n + 1);

          if (typeof msg.onlineCount === 'number') setOnlineCount(msg.onlineCount);

          const currentLocalId = localUserIdRef.current;
          if (!currentLocalId) return;

          const nextMap = new Map<string, PlayerPresence>();
          for (const p of msg.players) {
            if (p.userId && p.userId !== currentLocalId) {
              nextMap.set(p.userId, { ...p, position: { ...p.position } });
            }
          }

          // Update ref synchronously - useFrame reads this every frame for live updates
          remotePlayersMapRef.current = nextMap;

          const newIds = [...nextMap.keys()];
          const prevIds = remotePlayerIdsRef.current;
          const idsChanged =
            newIds.length !== prevIds.length || newIds.some((id, i) => id !== prevIds[i]);
          remotePlayerIdsRef.current = newIds;
          if (idsChanged) {
            setRemotePlayerIds(newIds);
          }

          presenceLogCountRef.current++;
          if (presenceLogCountRef.current % 30 === 1) {
            console.log(`${LOG_PREFIX} presence_update received players=${msg.players.length} remote=${newIds.length}`);
            pushSocketLog('receive', `presence_update players=${msg.players.length}`);
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) return;
        console.log(`${LOG_PREFIX} close`);
        const wasIntentional = intentionalCloseRef.current;
        if (!wasIntentional) {
          pushSocketLog('close', 'socket closed');
        }
        intentionalCloseRef.current = false;
        setConnected(false);
        wsRef.current = null;
        remotePlayersMapRef.current = new Map();
        remotePlayerIdsRef.current = [];
        setRemotePlayerIds([]);
        setOnlineCount(0);

        if (!wasIntentional && enabled) {
          const attempt = reconnectAttemptRef.current + 1;
          reconnectAttemptRef.current = attempt;
          const delay = Math.min(RECONNECT_BASE_DELAY_MS * 2 ** (attempt - 1), RECONNECT_MAX_DELAY_MS);
          pushSocketLog('connect', `reconnect in ${delay}ms`);
          reconnectTimerRef.current = window.setTimeout(() => {
            reconnectTimerRef.current = null;
            connect();
          }, delay);
        }
      };

      ws.onerror = () => {
        if (wsRef.current !== ws) return;
        console.log(`${LOG_PREFIX} error`);
        if (!intentionalCloseRef.current) {
          pushSocketLog('error', 'socket error');
        }
        ws.close();
      };
    };

    connectRef.current = connect;
    connect();

    let rafId = 0;
    let lastTick = 0;
    const poll = (now: number) => {
      if (now - lastTick >= POSITION_UPDATE_INTERVAL_MS) {
        sendPositionIfChanged();
        lastTick = now;
      }
      rafId = requestAnimationFrame(poll);
    };
    rafId = requestAnimationFrame(poll);

    return () => {
      cancelAnimationFrame(rafId);
      if (reconnectTimerRef.current != null) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      connectRef.current = null;
      intentionalCloseRef.current = true;
      wsRef.current?.close();
      wsRef.current = null;
      lastSentRef.current = null;
      setConnected(false);
      remotePlayersMapRef.current = new Map();
      remotePlayerIdsRef.current = [];
      setRemotePlayerIds([]);
    };
  }, [token, localUserId, enabled, pushSocketLog, sendPositionIfChanged]);

  return {
    remotePlayersMapRef,
    remotePlayerIds,
    connected,
    onlineCount,
    chatMessages,
    sendChat,
    disconnect,
    sentUpdates,
    receivedUpdates,
    socketLogs
  };
}

# Multiplayer Flow & Local Debug Guide

## Status
Phase 2 + Phase 2.5 runtime is implemented and working; this document is the technical reference for Phase 3 hardening.

## Local vs Docker Mode

| Mode | Server | Client | Display name |
|------|--------|--------|---------------|
| **Local** | 4000 | 5174 | Scania |
| **Docker** | 4001 | 5175 | Bera |

Each server sends its display name via `SERVER_DISPLAY_NAME` env; client fetches from `/api/server/info` and shows it in the login selector and game HUD.

**Per-server isolation:**
- **Database:** Scania uses `roc_scania`, Bera uses `roc_bera`. Postgres init creates both on first `docker compose up`. For existing setups: `pnpm db:create`.
- **Session:** Token stored per server (`roc_session_token_scania`, `roc_session_token_bera`).
- **Recent players:** Stored per server (`roc_recent_players_scania`, etc.).

**Scripts:**
- `pnpm start:local` – server 4000 + client 5174
- `pnpm start:docker` – server 4001 + client 5175 (default `pnpm start`)
- `pnpm start:local:server` / `pnpm start:local:client` – run individually

**VS Code debug configs:** `Debug Server (Local)`, `Debug Client (Local)`, `Local (full debug)` for 4000/5174.

## End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLIENT (Browser)                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Login → POST /api/login → get JWT token                                 │
│ 2. Bootstrap → GET /api/bootstrap?token=... → spawn position, player data  │
│ 3. GamePage mounts → useMultiplayer connects WebSocket                      │
│ 4. WebSocket: ws://HOST:PORT/ws?token=JWT                                   │
│ 5. On open: send first position_update                                      │
│ 6. Every 16ms: send position_update { position, direction } (~60fps)       │
│ 7. On message: receive presence_update or presence_leave                    │
│ 8. presence_update → remotePlayersMapRef.current = nextMap (sync update)    │
│ 9. RemotePlayerMesh useFrame: reads presence from ref every frame            │
│    → live position updates, bypasses React render cycle                      │
│ 10. Interpolation: target smoothing + lerp for smooth movement              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ SERVER GATEWAY (Fastify, stateless per instance)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ WebSocket /ws + REST                                                         │
│ 1. Extract token from query string                                           │
│ 2. verifySession(token) → userId, username, serverId                         │
│ 3. Register/refresh presence in Redis (TTL)                                  │
│ 4. On message (position_update):                                             │
│    - write latest presence snapshot to Redis                                 │
│    - publish presence_update to Redis pub/sub channel                        │
│    - forward nearby updates to connected local sockets                        │
│ 5. On Redis message: apply cross-instance updates to local clients           │
│ 6. On close/error: publish presence_leave + remove from Redis indexes        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ REDIS REALTIME LAYER (ephemeral)                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ - Presence snapshot keys with TTL                                             │
│ - Pub/sub channels for presence_update / presence_leave                       │
│ - Per-server live-player index for list API                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Live Position Updates (Ref-Based Architecture)

Remote player positions must update every frame for smooth movement. React's state
updates are batched and asynchronous, which can cause visible lag when the other
player moves.

**Solution:** A ref-based store (`remotePlayersMapRef`) updated synchronously when
`presence_update` is received. `RemotePlayerMesh` reads from this ref inside
`useFrame` every frame, bypassing React's render cycle. This ensures:

- Position updates apply immediately (no batching delay)
- `remotePlayerIds` state only changes on join/leave (minimal re-renders)
- useFrame always sees the latest presence data

## Key Files

| Role | File |
|------|------|
| Client WebSocket | `apps/client/src/hooks/useMultiplayer.ts` |
| Remote player render | `apps/client/src/components/GameScene.tsx` (RemotePlayerMesh) |
| Server WebSocket | `apps/server/src/realtime/websocket.ts` |
| Redis-backed presence service | `apps/server/src/realtime/presence.ts` |
| API base URL (client) | `VITE_API_BASE_URL` env, default `http://localhost:4000` |

## Redis Key and Channel Strategy

Use stable server/realm-scoped naming so any gateway instance can route the same data.

- Connection hash key: `roc:presence:conn:{connectionId}` (position/direction/server/realm/user, TTL).
- User lookup key: `roc:presence:user:{userId}` -> `connectionId` (TTL).
- Online set key: `roc:presence:server:{serverId}:realm:{realm}:connections`.
- GEO key for nearby lookup: `roc:presence:server:{serverId}:realm:{realm}:geo`.
- Server token index set: `roc:presence:servers`.
- Pub/sub channel: `roc:presence:events` (`join`/`update`/`leave` events).

Payload guidance:
- `presence_update`: `userId`, `username`, `position`, `direction`, `timestamp`.
- `presence_leave`: `userId`, `timestamp`, `reason`.

## Debug Checklist

1. **WebSocket connects?** -> Check status pill shows "· Online".
2. **Position sent?** -> Add `console.log` in `useMultiplayer` send loop.
3. **Gateway receives update?** -> Confirm server log for `position_update`.
4. **Redis write succeeds?** -> Verify presence key exists and TTL is refreshing.
5. **Redis pub/sub fires?** -> Subscribe to `roc:presence:events` and confirm `join/update/leave`.
6. **Cross-instance fanout works?** -> Open two clients routed to different gateway instances.
7. **Client receives `presence_update`?** -> Log `ws.onmessage`.
8. **Nearby filter valid?** -> Confirm players are within configured chunk radius.
9. **Live players API accurate?** -> Compare `GET /api/server/live-players` or `/api/presence/online` output to active clients.

## Run Locally (Local mode: 4000 / 5174)

Use **Local mode** for debugging – client on 5174, server on 4000.

### 1. Start Postgres + Redis (Docker)

```powershell
docker compose -f docker/compose.yml up -d postgres redis
```

### 2. Run server + client (Local mode)

```powershell
pnpm start:local
```

Or run separately:
- Terminal 1: `pnpm start:local:server` (4000)
- Terminal 2: `pnpm start:local:client` (5174)

### 3. Open the app

Open **http://localhost:5174** in your browser.

## Debug in VS Code

**Important:** Use the **Run and Debug** panel (Ctrl+Shift+D), select a config from the dropdown, then press **F5**.

### Local mode (4000 / 5174) – recommended for debugging

1. **Start Postgres + Redis:** `docker compose -f docker/compose.yml up -d postgres redis`
2. **Start client** in a terminal: `pnpm start:local:client`
3. **F5** → choose **"Local (full debug)"** (starts server + Chrome with debugger)
4. **Set breakpoints** in `websocket.ts`, `presence.ts`, `useMultiplayer.ts`, `GameScene.tsx`
5. **Login and move** – breakpoints hit

Or run individually:
- **Debug Server (Local)** – server on 4000
- **Debug Client (Local)** – Chrome to http://localhost:5174 (client must be running)

### Docker mode (4001 / 5175)

- **Debug Server (Docker)** – server on 4001
- **Debug Client (Docker)** – Chrome to http://localhost:5175
- **Docker (full debug)** – both (use when only Postgres is in Docker)

---

## Quick Debug Logging

**useMultiplayer.ts** – add after `ws.onmessage`:
```ts
if (msg.type === 'presence_update') {
  console.log('[WS] presence_update', msg.players?.length, msg.players);
}
```

**websocket.ts** – add in socket.on('message'):
```ts
app.log.info({ connId, position }, 'position_update');
```

## Common Issues

| Symptom | Check |
|---------|-------|
| "· Online" never shows | WebSocket failed to connect; verify token, CORS, server running |
| Other player not visible | Are they within 15 chunks (~240 units)? Move closer. |
| Other player stuck / not moving | Ref-based store ensures live updates; check presence_update in console |
| Presence missing across instances | Check Redis pub/sub channel naming and gateway subscription |
| Live-player list incorrect | Verify connection-set/GEO cleanup and TTL expiry for stale entries |
| CORS errors | Server sets `Access-Control-Allow-Origin` from request origin |

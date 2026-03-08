# Technical Architecture

## Purpose
Define technical architecture baseline, system responsibilities, and non-negotiable shared-world rules across MVP and the stateless realtime foundation.

## Status
Active architecture baseline.

## Last Updated
2026-03-06

## Related Documents
- `docs/mvp/mvp-scope.md`
- `docs/architecture/diagrams.md`
- `docs/product/implementation-roadmap.md`
- `docs/project-rules.md`

## Goals
- Deliver first playable quickly with a maintainable codebase for one senior developer.
- Keep architecture monorepo-friendly and future-expandable.
- Isolate game rendering, world generation, UI shell, and backend persistence concerns.
- Avoid rework traps that would block later multiplayer evolution.
- Establish one shared persistent world model from day one without multiplayer runtime complexity.

## Non-Goals (MVP)
- Full authoritative multiplayer simulation.
- Distributed microservices.
- Complex event-driven infrastructure.
- Deep game systems beyond movement/exploration/save-load/settings.

## Major System Components
- `apps/client`: Browser game client (`React + TypeScript + Vite + react-three-fiber`).
- `apps/server`: Backend API (`Node.js + TypeScript + Fastify`).
- `packages/world-engine`: Deterministic world/chunk/biome generation logic.
- `packages/ui`: Reusable app/HUD components (Storybook-focused).
- `packages/shared-types`: Shared API DTOs and domain types.
- `docker/`: Local orchestration assets for dev stack.

## Shared World Model (Foundational Rule)
- There is exactly one shared world for MVP and beyond.
- The world is identified by a global world seed and shared world metadata.
- The world is not fully pre-generated.
- Chunks/tiles are generated lazily when first requested or visited.
- Once generated, discovered chunks become persistent shared world records.
- New players must spawn only in discovered/generated spawnable chunks/tiles.

## Shared World Generation Rules (Explicit)
- The world seed defines terrain deterministically.
- Chunk coordinates plus seed generate terrain output.
- When a chunk is first requested, generate it.
- After first generation, store it as discovered in shared-world persistence.
- All discovered chunks belong to the one persistent shared world.

## Player Spawning Rules (Explicit)
- New players spawn only in discovered spawnable chunks.
- Spawn selection is random among valid discovered candidates.
- Advanced spawn logic is deferred (homes, cities, spawn zones).

## Frontend Responsibilities
- Handle login UI and lightweight session token storage.
- Drive player input, movement intent, and camera behavior.
- Request and consume world seed/config from server.
- Execute deterministic chunk generation through shared `world-engine` for unexplored chunk requests.
- Render 3D world and maintain chunk lifecycle around player.
- Render HUD/app shell and modal flows independent of render loop.
- Save/load settings and trigger profile persistence flows.
- Request spawn resolution from server and honor discovered-area spawn constraints.

## Rendering Responsibilities
- Canvas owns terrain/chunk/entity visual representation only.
- UI layer owns HUD, modals, and interaction forms.
- Keep render state separate from app UI state to limit rerender coupling.
- Use tunable constants for render distance, chunk size, and LOD strategy.

## Server Responsibilities
- Provide MVP login endpoint and issue dev-friendly session token.
- Return player profile, shared world seed/reference, and stored settings.
- Accept save updates (position, settings, minimal profile metadata).
- Persist data in PostgreSQL with clear schema and migration path.
- Expose small API surface; do not absorb simulation authority yet.
- Persist discovered/generated world chunks and spawnable-discovered location indexes.
- Resolve new-player spawn location from discovered spawnable records.
- Feature 1.1: WebSocket endpoint `/ws` for real-time presence and position sync.
- Feature 1.1: REST endpoint `GET /api/player/:userId/inspect` for player profile inspection.
- Feature 1.2: Stateless WebSocket/API gateway instances (no in-memory shared presence assumptions).
- Feature 1.2: Redis distributed cache + pub/sub for live presence fanout and cross-instance coordination.
- Feature 1.2: REST endpoint for listing live players by server (`GET /api/server/live-players`).

## World Generation Strategy
- Deterministic generation from `(worldSeed, chunkX, chunkY)` (or tile coordinates where needed).
- Biome assignment driven by low-frequency noise fields.
- Terrain variation driven by secondary noise layers.
- Biome transition smoothing via interpolation thresholds or blended masks.
- Keep generation pure and testable in `packages/world-engine`.
- Generation is lazy: execute only when chunk is first requested and no persisted discovered record exists.

## Chunking Strategy
- Fixed chunk dimensions (example: `32x32` world units; tune later).
- Active chunk set centered on player with configurable radius.
- On movement:
  - load existing discovered chunks when present,
  - generate chunks only when first discovered/requested,
  - persist generated chunk metadata/state to shared world store,
  - unload distant chunks outside retention radius,
  - preserve short-lived cache to avoid immediate regeneration churn.
- Determinism remains required for reconstruction and validation paths.

## Generated Terrain State vs Future Mutable World State
- **Generated terrain state (MVP now)**:
  - deterministic output from seed + coordinates,
  - persisted discovered/generated chunk record,
  - biome/terrain descriptors needed for stable reload.
- **Future mutable world state (deferred)**:
  - player-built structures,
  - terrain edits,
  - ownership or faction overlays,
  - dynamic simulation layers.
- Keep schema boundaries clear so mutable overlays can be added without redesigning generation foundations.

## Save/Load Strategy
- Save payload (MVP):
  - `playerId`
  - `worldSeed` (or world reference id)
  - `position` (x/y/z)
  - `settings` (graphics/UI/input subset)
  - `keybindings`
  - timestamps
- Save triggers:
  - explicit save in menu (optional),
  - periodic autosave,
  - graceful unload/before-exit best effort.
- Load on login before world spawn; fallback to defaults if no save exists.
- For new players without prior position:
  - server selects random valid spawn from discovered/generated spawnable locations,
  - client spawns only after receiving approved discovered-area location.

## New Player Spawn Selection (Temporary MVP Logic)
- Input set: discovered/generated chunks/tiles marked spawnable.
- Selection method: random choice from valid set.
- Constraints:
  - do not spawn in undiscovered/unpersisted territory,
  - avoid invalid terrain classes (water/cliffs/non-spawnable flags),
  - return deterministic fallback when candidate set is empty (bootstrap starter discovered area).
- This logic is intentionally replaceable by advanced spawn systems later.

## Auth Approach for MVP
- Simple username/password or username-only dev auth (documented decision in implementation).
- Fastify session/JWT token for API access.
- Keep auth module replaceable; avoid coupling gameplay code to auth provider details.
- No social providers or account recovery flows in MVP.

## Local vs Server Responsibility Decisions
- **Local/client**
  - runtime chunk generation execution for unexplored requests and rendering,
  - movement and camera feel,
  - immediate UI interactions.
- **Server**
  - identity/session,
  - source-of-truth persistence for save data,
  - shared world seed/config provisioning,
  - discovered/generated chunk persistence,
  - new-player spawn resolution from discovered areas.
- Rationale: fast iteration and low infra complexity now, while preserving migration path.

## Feature 1.1 Multiplayer (Implemented Baseline)
- Transport: `@fastify/websocket` on path `/ws`. Auth via `?token=...` query param.
- In-memory presence: `connectionId -> { userId, username, position, direction }`.
- Nearby broadcast: only clients within ~3 chunks receive presence updates.
- Client sends `position_update` messages; server relays to nearby connections.
- No persistence of presence; save/load remains REST + PostgreSQL.

## Feature 1.2 Realtime Foundation (Implemented)
- Server runtime becomes stateless across horizontally scaled WebSocket/API instances.
- Redis becomes the realtime coordination layer for:
  - distributed live presence cache (ephemeral state),
  - pub/sub channels for cross-instance presence updates and leave events,
  - server-scoped live-player index used by API listing.
- PostgreSQL remains the durable source of truth for:
  - accounts, profile/save state, discovered chunks, and world metadata.
- Presence durability boundary:
  - Redis data is ephemeral and may be rebuilt from active connections,
  - PostgreSQL is the only durable store for gameplay persistence.
- Implemented APIs:
  - `GET /api/server/live-players`
  - `GET /api/presence/servers`
  - `GET /api/presence/online`
  - `GET /api/presence/player/:userId`
  - `GET /api/admin/live-users`
  - `POST /api/admin/remove-user`

## Operations Hardening (Current Focus)
- Harden cross-instance realtime behavior with stronger integration coverage.
- Improve operational observability and runbooks for websocket/presence flows.
- Keep gateway stateless contract intact while improving developer and admin UX.

## Stateless Gateway Responsibilities
- Authenticate WebSocket/API requests and map them to `userId` + server context.
- Validate and normalize inbound position/presence payloads.
- Write ephemeral presence state to Redis using short TTL refresh.
- Publish presence updates to Redis pub/sub for other instances.
- Subscribe to Redis channels and forward relevant nearby updates to connected clients.
- Expose read API for live players on current server scope.
- Keep gateway nodes replaceable and horizontally scalable without sticky in-memory coupling.

## Durability Boundaries
- **Redis (ephemeral realtime state)**:
  - active socket/user presence,
  - last-known position/direction for live session visibility,
  - pub/sub transport events.
- **PostgreSQL (durable gameplay state)**:
  - user identity and profile,
  - save/load state,
  - world metadata,
  - discovered/generated chunks and spawnable indexes.
- Rule: if state must survive disconnect/restart as product data, persist to PostgreSQL.

## Future Multiplayer Evolution Path
- Step 1: keep world generation deterministic and shared between client/server packages.
- Step 2: maintain persistent discovered chunk registry as shared world baseline.
- Step 3 (Feature 1.1 done): presence sync and inspect; client-authoritative movement.
- Step 4 (Feature 1.2): move realtime presence to stateless multi-instance gateway + Redis pub/sub.
- Step 5: add authoritative movement validation endpoints/services.
- Step 6: introduce region/session-based world authority model.
- Step 7: evolve persistence model for concurrent player and mutable world state.

## Observability, Logging, and Testing Expectations
- Client:
  - structured console logging in dev mode,
  - debug overlay toggle for chunk/biome coordinates.
- Server:
  - Fastify request logging,
  - startup and DB connectivity logs,
  - chunk discovery/generation persistence logs,
  - spawn-selection decision logs for new players,
  - error serialization for API debugging.
- Testing:
  - unit tests for world generation determinism and biome boundaries,
  - unit tests for lazy-generation first-discovery behavior,
  - unit tests for spawn-candidate filtering and random selection constraints,
  - unit tests for keybinding conflict logic,
  - integration tests for login + save/load API contracts,
  - integration tests for discovered chunk persistence and spawn from discovered areas,
  - basic smoke tests for local compose startup.

## Major Technical Decisions
- Monorepo with shared packages.
- React + TypeScript + Vite + react-three-fiber client stack.
- Fastify + TypeScript server stack.
- PostgreSQL persistence.
- Docker Compose local environment.
- Storybook for UI components only (not full world simulation).
- One shared persistent world with lazy chunk generation and discovered chunk persistence.
- Redis is the distributed realtime layer for live presence and pub/sub fanout in stateless server topology.

## Deferred Decisions
- Exact auth mechanism hardening for production.
- Hosting provider choices (documented in deployment strategy with options).
- Server-side chunk authority model.
- Advanced spawn systems (homes/towns/spawn points/safe zones/factions).
- LOD sophistication and advanced terrain rendering optimization.
- Telemetry platform and long-term analytics tooling.

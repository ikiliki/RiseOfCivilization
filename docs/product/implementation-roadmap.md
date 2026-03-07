# Implementation Roadmap

## Purpose
Define milestone-based implementation sequencing from documentation baseline to first playable completion.

## Status
Active roadmap with MVP + multiplayer realtime foundations complete; focus is now Phase 3 operations and hardening.

## Last Updated
2026-03-06

## Related Documents
- `docs/mvp/mvp-scope.md`
- `docs/architecture/technical-architecture.md`
- `docs/architecture/diagrams.md`
- `PLAN.md`

## Guiding Principle
Build only what is required to reach first playable quickly and cleanly, then iterate.

## Finalized Shared World Decision
- One shared persistent world is the architecture baseline.
- The world is not pre-generated.
- Terrain generation is deterministic from `worldSeed + chunk coordinates`.
- Chunk generation happens lazily on first request/discovery.
- First-generated chunks are persisted as discovered shared-world records.
- New players spawn only in discovered spawnable chunks.
- MVP spawn choice is random among valid discovered locations.
- Advanced spawn policy (homes, cities, spawn zones) is deferred.

## Milestones

### Milestone 0: Documentation Foundation (Complete)
- MVP scope and non-goals documented.
- Architecture and diagrams documented.
- Dev workflow, deployment, and Storybook strategy documented.

### Milestone 1: Monorepo and Tooling Scaffold
- Create workspace structure (`apps`, `packages`, `docker`, `docs`).
- Configure package manager workspaces and shared TypeScript config.
- Set up linting, formatting, basic test harness.
- Set up Docker Compose for client/server/postgres.

### Milestone 2: Backend Core (Fastify + Postgres)
- Health endpoint and baseline API structure.
- MVP auth endpoint (dev-friendly).
- Player state read/write endpoints.
- DB schema + migrations for user/player settings/save state.
- Shared world metadata schema (single global world seed).
- Discovered/generated chunk persistence schema and repository layer.
- New-player spawn selection endpoint from discovered spawnable records.

### Milestone 3: Frontend Core (R3F + HUD Shell)
- Client app bootstrap with canvas + UI layer separation.
- Login flow and session bootstrap.
- Spawn bootstrap flow that requests server-approved discovered-area spawn.
- Top-down camera + movement controls.
- HUD shell with settings modal entry points.

### Milestone 4: World Generation and Chunk Streaming
- Implement deterministic chunk generation in `world-engine` using shared world seed + coordinates.
- Add biome model: grassland/desert/ice.
- Add visible transition logic.
- Chunk load/unload around player with tunable radius.
- Lazy generation only on first discovery/request of unexplored chunks.
- Persist generated/discovered chunk records to shared world state.

### Milestone 5: Save/Load + Settings + Keybinding
- Persist player position/settings/keybindings via API.
- Autosave/manual save strategy.
- Keybinding remap UX with conflict handling.
- Reload resilience test: resume from latest saved state.

### Milestone 6: First Playable Stabilization
- Performance pass (chunk churn, render budget, memory behavior).
- Bug fixes and UX polish for login/settings/HUD.
- Minimal smoke tests and regression checks.
- Mark first playable complete.

### Milestone 7: Phase 2 Multiplayer Foundation (Complete)
- WebSocket real-time layer via @fastify/websocket.
- In-memory presence store; nearby-player broadcast only.
- Client: connect, send position, receive presence, render remote players.
- Click-to-inspect: open profile panel with basic info.
- REST inspect endpoint; PlayerInspectPanel UI component.

### Milestone 8: Phase 2.5 Redis Realtime Foundation (Complete)
- Move from in-memory presence assumptions to stateless WebSocket/API gateway instances.
- Introduce Redis distributed cache + pub/sub for live presence synchronization across instances.
- Add server-scoped live-player listing API for operations and diagnostics.
- Keep PostgreSQL as durable gameplay persistence boundary (no durable presence in Redis).
- Validate local/dev runtime with Redis included in compose and debug workflows.
- Ship baseline admin operations UI and remove-user workflow on top of live-player APIs.

### Milestone 9: Phase 3 Operations UI and Hardening (Current)
- Expand integration and contract test coverage for realtime and admin endpoints.
- Improve operations runbooks and debugging workflows for Redis/presence/socket events.
- Simplify documentation portal UX to a phase/task board optimized for execution visibility.
- Continue gameplay quality passes while preserving stateless realtime guarantees.

## Suggested Build Order
1. Workspace + local infra
2. Shared world seed + discovered-chunk persistence API
3. Frontend shell, login, and discovered-area spawn bootstrap
4. Deterministic world generation + biomes + lazy discovery generation
5. Save/load and settings/keybindings
6. Phase 2 multiplayer baseline (WebSocket + inspect)
7. Phase 2.5 stateless realtime + Redis foundation + live-player API
8. Phase 3 operations hardening and test coverage
9. Stabilization and docs sync

## Dependency Map
- Frontend login depends on backend auth endpoint.
- New-player spawn depends on discovered-chunk persistence and spawn-candidate query endpoint.
- Spawn/resume depends on player-state read endpoint and shared world metadata.
- Chunk streaming depends on world-engine package availability.
- Lazy generation flow depends on chunk existence lookup + persistence write path.
- Settings/keybindings persistence depends on backend save endpoint.
- Storybook UI work can proceed in parallel for isolated components.

## Branch and Task Granularity (Solo Developer)
- Prefer short-lived branches focused on one vertical slice.
- Typical branch size: 1-3 days of work, not multi-week epics.
- Recommended naming:
  - `feat/scaffold-monorepo`
  - `feat/backend-player-state`
  - `feat/client-movement-camera`
  - `feat/world-chunk-biomes`
  - `feat/settings-keybind-persistence`
- Keep PRs reviewable even if self-reviewed later.

## Deferred Milestones (Explicit)
- Phase 3 admin/operations UI for live-player monitoring and controls.
- Full server-authoritative movement validation.
- Advanced spawn systems (homes, towns, fixed spawn points, safe zones, faction-based spawn logic).
- Combat/crafting/NPC/economy systems.
- Settlement and civilization growth systems.
- Advanced terrain editing/simulation depth.
- Production-hard auth and account system.

## Done Definition per Milestone
- Feature works locally from clean startup.
- Basic tests added or updated.
- Docs updated if decisions changed.
- No hidden architectural divergence from documented source of truth.

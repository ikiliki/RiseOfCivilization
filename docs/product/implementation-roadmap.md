# Implementation Roadmap

## Purpose
Define feature-based implementation sequencing from documentation baseline to first playable completion.

## Status
Active roadmap with MVP + multiplayer + Redis + documentation hub complete; focus is operations hardening.

## Last Updated
2026-03-08

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

## Features

### Feature 1: MVP (Complete)
- First playable: world, chunk, spawn, save/load, HUD, settings, keybindings.
- Single-player login flow (dev-friendly, no third-party OAuth).
- One shared world for all players, identified by a global world seed.
- Player spawn into deterministic seeded terrain that is generated lazily on first discovery/request.
- Top-down movement with camera follow.
- Chunk-based procedural world generation.
- Three biome foundations: grassland, desert, ice.
- Visible biome transitions.
- Persistence of discovered/generated chunks as shared world records.
- New-player spawn selection only from already discovered spawnable chunks.
- Save/load of player position and selected settings.
- Polished HUD shell and settings modal.
- Keyboard rebinding for core movement actions.
- Backend API + PostgreSQL persistence.
- Local Docker Compose development setup.
- Storybook for reusable HUD/app UI components.

### Feature 1.1: Multiplayer infra (Complete)
- WebSocket real-time layer via @fastify/websocket.
- In-memory presence store; nearby-player broadcast only.
- Client: connect, send position, receive presence, render remote players.
- Click-to-inspect: open profile panel with basic info.
- REST inspect endpoint; PlayerInspectPanel UI component.

### Feature 1.2: Redis infra (Complete)
- Move from in-memory presence assumptions to stateless WebSocket/API gateway instances.
- Introduce Redis distributed cache + pub/sub for live presence synchronization across instances.
- Add server-scoped live-player listing API for operations and diagnostics.
- Keep PostgreSQL as durable gameplay persistence boundary (no durable presence in Redis).
- Validate local/dev runtime with Redis included in compose and debug workflows.
- Ship baseline admin operations UI and remove-user workflow on top of live-player APIs.

### Feature 1.3: Documentation hub (Complete)
- Internal docs platform with features visibility.
- Hub as default tab (Hub | Home | Plan | Tech).
- Feature sidebar with feature filter.
- FeaturesByStatus (Ahead | In Progress | Done).
- WorkItemCard with expandable sub-tasks.
- Execution visibility from content.generated.js.

## Suggested Build Order
1. Workspace + local infra
2. Shared world seed + discovered-chunk persistence API
3. Frontend shell, login, and discovered-area spawn bootstrap
4. Deterministic world generation + biomes + lazy discovery generation
5. Save/load and settings/keybindings
6. Feature 1.1: Multiplayer baseline (WebSocket + inspect)
7. Feature 1.2: Stateless realtime + Redis foundation + live-player API
8. Feature 1.3: Documentation hub
9. Operations hardening and test coverage

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

## Deferred (Explicit)
- Full server-authoritative movement validation.
- Advanced spawn systems (homes, towns, fixed spawn points, safe zones, faction-based spawn logic).
- Combat/crafting/NPC/economy systems.
- Settlement and civilization growth systems.
- Advanced terrain editing/simulation depth.
- Production-hard auth and account system.

## Done Definition per Feature
- Feature works locally from clean startup.
- Basic tests added or updated.
- Docs updated if decisions changed.
- No hidden architectural divergence from documented source of truth.

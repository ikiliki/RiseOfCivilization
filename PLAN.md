# Project Plan

## Purpose
Track active implementation status, completed features, and immediate next work.

## Status
Active.

## Last Updated
2026-03-08

## Related Documents
- `docs/project-rules.md`
- `docs/README.md`
- `docs/product/implementation-roadmap.md`
- `docs/mvp/mvp-scope.md`

## Agents by Workflow
| Step | Agent | Purpose |
|------|-------|---------|
| **1. Design** | `/product` | Design feature, add Figma, examples, diagrams, document in `docs/features/` |
| **2. Architecture** | `/team-lead` | Break product doc into architecture, technical spec, implementation tasks |
| **3. Implementation** | `/coder` | Implement fullstack (DB, API, client) from technical spec |
| **4. DevOps** | `/devops` | Docker, deployment, CI/CD |
| **5. Docs platform** | `/documentations` | Collect docs, build internal backoffice platform |
| After implementation | `/planner` | Update PLAN.md, docs, run docs:sync |
| Verification | `/verifier` | Confirm completed work actually works |
| Errors / test failures | `/debugger` | Root cause analysis and fix |
| Code changes | `/test-runner` | Run tests, fix failures |

**Workflow:** `/product` → `/team-lead` → `/coder` → `/planner`. Use `/devops` for infra, `/documentations` for docs platform.

## Current Feature
- Feature 1.3: Documentation hub (with ongoing operations hardening)

## Completed
- **Feature 1: MVP** – First playable, world, chunk, spawn, save/load, HUD, settings, keybindings
- **Feature 1.1: Multiplayer infra** – WebSocket, presence, inspect, player rendering
- **Feature 1.2: Redis infra** – Stateless realtime, Redis presence, pub/sub, admin APIs
- **Feature 1.3: Documentation hub** – Internal docs platform with features visibility
- Monorepo scaffold created with `apps/client`, `apps/server`, `packages/shared-types`, `packages/world-engine`, `packages/ui`, and `docker`.
- Workspace tooling configured: TypeScript, ESLint, Prettier, Vitest, pnpm workspaces.
- Docker local stack implemented in `docker/compose.yml` with client/server/postgres/redis services.
- Backend foundation implemented with Fastify, SQL migration runner, PostgreSQL schema, and health endpoint.
- MVP persistence schema implemented for `users`, `player_state`, `world_metadata`, and `discovered_chunks`.
- Auth/bootstrap/save API slice implemented:
  - `POST /api/auth/login`
  - `GET /api/bootstrap`
  - `GET /api/world/metadata`
  - `POST /api/player/save`
  - `POST /api/chunks/discover`
  - `GET /api/chunks/discovered`
- Shared deterministic `world-engine` implemented with lazy chunk generation helpers and 3-biome foundation (`grassland`, `desert`, `ice`) plus determinism tests.
- Shared world spawning rules implemented:
  - new players spawn from discovered spawnable chunks,
  - MVP bootstrap fallback seeds one starter discovered chunk if no candidates exist.
- Client first-playable runtime implemented:
  - login screen,
  - top-down 3D scene,
  - WASD movement,
  - camera follow,
  - chunk radius loading/unloading behavior,
  - deterministic generation for undiscovered chunks,
  - discovery persistence calls to server.
- HUD shell, settings modal, keybinding editor, stats placeholder, and currency placeholder implemented via `packages/ui`.
- Storybook configured for `packages/ui` with required stories (button, settings modal, keybinding row, stat display, currency display, HUD shell).
- Internal React docs portal wired into Docker Compose on port `5555`.
- Validation completed: `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` pass.
- Feature 1.1 multiplayer foundation implemented:
  - WebSocket real-time layer via @fastify/websocket.
  - In-memory player presence store with nearby-player broadcast.
  - Client connects to `/ws?token=...`, sends position updates, receives presence.
  - Remote players rendered in world (blue spheres), local player (white) distinguished.
  - Click-to-inspect: click another player opens profile panel.
  - Player inspect panel: username, ID, currency, stats, location/biome.
  - REST endpoint `GET /api/player/:userId/inspect` for profile data.
- Feature 1.2 stateless realtime foundation implemented and validated:
  - Redis-backed distributed presence (`apps/server/src/realtime/presence.ts`) with TTL and server/realm indexes.
  - Cross-instance realtime fanout via Redis pub/sub from `apps/server/src/realtime/websocket.ts`.
  - Presence APIs implemented and wired:
    - `GET /api/server/live-players`
    - `GET /api/presence/servers`
    - `GET /api/presence/online`
    - `GET /api/presence/player/:userId`
  - Basic admin operations API and UI implemented:
    - `GET /api/admin/live-users`
    - `POST /api/admin/remove-user`
    - `/admin` HTML + JS dashboard for live users and remove flow.
  - Swagger integrated on server for API exploration.
  - Redis UI added to Docker Compose stack.
  - Client realtime hardening completed:
    - duplicate socket guards and reconnect behavior,
    - dev-mode socket status panel with send/receive/error logs,
    - per-tick position updates and improved chat send feedback,
    - forced logout handling and session cleanup.
- Documentation Hub implemented in docs-site: Hub as default tab (Hub | Home | Plan | Tech), FeatureSidebar with feature filter, FeaturesByStatus (Ahead | In Progress | Done), WorkItemCard with expandable sub-tasks; execution visibility from content.generated.js.

## In Progress
- Operations hardening (post–Feature 1.3):
  - [ ] Add integration tests for cross-instance fanout and stale-presence cleanup.
  - [ ] Add API-level coverage for admin remove-user and live presence endpoints.

## Next
- Operations board and observability polish:
  - Simplify docs portal status board for feature/task execution visibility.
  - Add runbook snippets for Redis presence troubleshooting and forced logout flow.
- Realtime test hardening:
  - Add automated integration checks for fanout, disconnect, and TTL expiry paths.
  - Add contract tests for presence/admin endpoints.
- Product quality passes:
  - Tune multiplayer camera/nametag behavior and movement readability.
  - Continue debug overlay ergonomics and panel usability improvements.

## Blocked
- None.

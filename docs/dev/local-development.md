# Local Development

## Purpose
Define repeatable local development setup and operational conventions for the MVP stack, completed multiplayer realtime runtime, and Phase 3 hardening work.

## Status
Active.

## Last Updated
2026-03-06

## Related Documents
- `docs/mvp/mvp-scope.md`
- `docs/architecture/technical-architecture.md`
- `docs/dev/deployment-strategy.md`
- `.cursor/rules/RULES.md`

## Monorepo Structure
```text
/
  .cursor/
    PLAN.md
    rules/
      RULES.md
  apps/
    client/                 # React + Vite + R3F game client
    server/                 # Fastify API
  packages/
    world-engine/           # deterministic world/chunk/biome logic
    ui/                     # reusable HUD/app components
    shared-types/           # shared DTOs/domain contracts
  docs/
  docker/
```

## Docker Compose Services
Recommended baseline services:
- `client`: runs Vite dev server for game client.
- `server`: runs Fastify API in watch mode (WebSocket/API gateway behavior for realtime).
- `postgres`: PostgreSQL database for player/settings persistence.
- `redis`: distributed cache + pub/sub for live presence and cross-instance realtime fanout.
- `adminer`: lightweight DB UI at http://localhost:8080 (System: PostgreSQL, Server: postgres, User: postgres, Password: postgres, Database: roc).
- `storybook`: UI component dev at http://localhost:6006.
- `docs-site`: internal React docs portal at http://localhost:5555.

## Realtime Development Baseline
- WebSocket endpoint: `ws://localhost:4000/ws?token=<jwt>`
- Connect after login; client sends position updates, receives nearby player presence.
- Redis is required for stateless gateway behavior (presence cache + pub/sub).
- Test with multiple browser tabs/windows using different usernames.

## Shared World Development Constraints
- Use one shared world seed for all local users in the same environment.
- Do not pre-generate the entire world.
- Generate chunks lazily on first request/discovery.
- Keep chunk generation deterministic by `worldSeed + coordinates`.
- New players spawn only from discovered spawnable chunks.

## Environment File Strategy
- Root `.env.example`: shared defaults and doc comments only.
- `apps/client/.env.example`: client-specific public vars (`VITE_*`).
- `apps/server/.env.example`: server secrets/config vars.
- Local real env files (`.env`, `.env.local`) are gitignored.
- Keep naming consistent across compose + app runtime.

Suggested variables:
- `VITE_API_BASE_URL`
- `SERVER_PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `AUTH_TOKEN_SECRET`
- `WORLD_SEED_DEFAULT`

## Local Scripts and Commands
Use root-level workspace scripts for simplicity:
- `pnpm install` (or chosen package manager) at repo root.
- `pnpm dev` to run client + server concurrently outside Docker (requires Postgres on localhost:5432).
- `pnpm docker:up` for full local stack (client + server + postgres + redis).
- `pnpm docker:reset` to tear down, remove volumes, and bring stack back up with fresh DB/cache. Run after each change unless explicitly skipping it for a task.
- `pnpm docker:down` to stop and remove containers and volumes.
- `pnpm build:reset` to build all packages, then reset Docker (fresh DB).
- Hybrid: `docker compose -f docker/compose.yml up -d postgres redis` then `pnpm dev` to run app locally with Dockerized DB/cache.
- `pnpm test` for unit/integration tests.
- `pnpm lint` and `pnpm typecheck`.
- `pnpm storybook` for UI component development.
- `pnpm docs:sync` and `pnpm docs:dev` for the internal docs portal outside Docker.

Keep script names short and consistent; avoid script sprawl.

## Mocks and Stubs Strategy
- Allow local mock auth mode for rapid UI/game iteration.
- Keep API contract stable even when using mocked internals.
- Mock only non-critical systems (currency/stats/decorative data).
- Do not mock save/load persistence path once backend exists.
- Add explicit `MOCK_*` flags and keep defaults realistic.

## Debugging Workflow
- Start with `docker compose -f docker/compose.yml up` and watch server/client logs.
- Validate API quickly via curl/Postman before deep client debugging.
- Validate Redis connectivity before realtime debugging (`redis-cli ping` in container or logs).
- Use browser devtools and React devtools for HUD/settings flows.
- Add client debug overlay toggle showing:
  - current chunk coords,
  - loaded chunk count,
  - biome id at player location.
- Log chunk lifecycle events in dev mode only.

## Asset Handling Approach
- Store placeholder assets under app-local asset directories first.
- Keep asset names and paths stable to reduce refactor churn later.
- Prefer lightweight texture/material placeholders for MVP speed.
- Separate UI assets from world assets.
- Do not overbuild asset pipeline before first playable.

## Solo Developer Practical Rules
- One command should start everything needed for daily work.
- Keep setup reproducible on a clean machine.
- Fail fast on missing env vars with clear startup errors.
- Document every new local dependency in this file and update examples.

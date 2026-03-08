---
name: fullstack-impl
description: Implement full stack from technical spec. Use when implementing feature across frontend, backend, and database.
---

# Full Stack Implementation

Implement feature from technical spec: DB → API → Client.

## Order

1. **DB** – Migration first (apply db-migration skill)
2. **API** – Endpoints, services (apply api-implementation skill)
3. **Client** – Components, hooks, API calls (apply add-component skill)
4. **Wire** – Connect client to API, test flow

## Project Structure

- **Backend**: `apps/server` – Fastify, routes, services
- **Frontend**: `apps/client` – React, R3F, pages
- **Shared UI**: `packages/ui` – Reusable components
- **Types**: `packages/shared-types` – DTOs

## Conventions

- Follow `docs/project-rules.md` (component placement, TypeScript, etc.)
- Add components with `.styles.css` and stories
- Run `pnpm typecheck`, `pnpm test`, `pnpm build` after changes
- **Run `pnpm docker:reset`** after every change (mandatory; only skip if user explicitly says to)
- Update PLAN.md when tasks complete; run `pnpm docs:sync` if docs changed

---
name: architecture-design
description: Break feature into technical architecture. Use when designing system components, data flows, and technical boundaries.
---

# Architecture Design

Break feature/phase into technical architecture for implementation.

## Output

Update the feature doc with a `## Technical Architecture` section, or create `docs/architecture/<feature>-architecture.md`.

## Required Elements

1. **Components** – Client, server, packages affected
2. **Data flow** – Request/response, events, persistence
3. **API surface** – New or changed endpoints
4. **Database changes** – Tables, migrations
5. **Dependencies** – Between components, packages
6. **Non-goals** – What we explicitly won't do

## Monorepo Mapping

- `apps/client` – React, R3F, UI
- `apps/server` – Fastify, WebSocket, REST
- `packages/ui` – Shared HUD/components
- `packages/world-engine` – World/chunk logic
- `packages/shared-types` – DTOs

## Diagram

Add Mermaid diagram to `docs/architecture/diagrams.md` for new flows.

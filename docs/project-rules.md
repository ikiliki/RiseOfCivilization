# Rise Of Civilization Project Rules

## Purpose
Define authoritative product, architecture, coding, and documentation rules for agents and contributors.

## Status
Authoritative and active.

## Last Updated
2026-03-06

## Related Documents
- `PLAN.md`
- `docs/README.md`
- `docs/mvp/mvp-scope.md`
- `docs/architecture/technical-architecture.md`
- `docs/product/implementation-roadmap.md`

## Product Vision
- Deliver a clean first-playable MVP quickly for a solo senior developer workflow.
- Build a stable exploration foundation before deeper civilization systems.
- Keep architecture ready for expansion without paying multiplayer complexity costs now.

## MVP Boundaries
### In Scope
- Single-player login and session bootstrap.
- One shared persistent world.
- Lazy deterministic chunk generation by world seed plus chunk coordinates.
- Biome foundations: grassland, desert, and ice.
- Save/load of player position, settings, and keybindings.
- Backend API and PostgreSQL persistence.
- Local Docker-based development workflow.
- Storybook for reusable HUD and app UI components.

### Out of Scope
- Multiplayer networking and synchronization authority.
- Combat, crafting, NPC AI, and deep progression systems.
- Economy, settlement growth, and civilization simulation depth.
- Complex weather or ecosystem simulation.
- Monetization and advanced operations tooling.
- Mobile-first UX scope.

## Shared World Principles (Mandatory)
- Exactly one shared world exists.
- The world is not pre-generated.
- Terrain is deterministic from `worldSeed + coordinates`.
- Chunks generate lazily on first request/discovery.
- First-generated chunks are persisted as discovered shared-world records.
- New players spawn only in discovered spawnable chunks.
- MVP spawn selection can be random among valid discovered locations.
- Advanced spawn systems are deferred: homes, cities, zones, faction logic.

## Architecture Principles
### Monorepo Structure Target
- `apps/client`
- `apps/server`
- `packages/world-engine`
- `packages/ui`
- `packages/shared-types`
- `docs`
- `docker`

### Frontend Principles
- Use React, TypeScript, and Vite.
- Use Three.js through `react-three-fiber`.
- Separate game world rendering from HUD and app UI layers.
- Keep UI state separate from rendering state where practical.

### Backend Principles
- Use Node.js, TypeScript, and Fastify as default.
- Keep API surface small and explicit.
- Persist player state and shared-world metadata.

### Persistence Principles
- Use PostgreSQL as primary database.
- Persist only what MVP requires.
- Avoid premature multi-database or event-sourcing complexity.

### Tooling Principles
- Use Docker and Docker Compose for local reproducibility.
- Use Storybook for reusable UI components.
- Use ESLint, Prettier, and Vitest from the start.
- **After every change**, run `pnpm docker:reset`. Mandatory for all agents (including /coder). Only skip if the user explicitly says "don't reset Docker" or "skip docker reset".

## Coding Principles
- TypeScript-first with strict typing.
- Avoid `any` unless explicitly justified.
- Keep modules small and focused.
- Keep domain logic out of presentational components.
- Keep rendering logic separate from world-generation logic.
- Prefer explicit constants and readable names over magic numbers.
- Add comments only for non-obvious intent.

## UI and Component Placement Rules
- Components belong in one of:
  - `src/components`
  - `src/features/components`
  - `src/pages`
- Each component has a co-located `.styles` file.
- Reusable components have co-located stories.
- Storybook is for UI and HUD components, not world simulation runtime.

## Documentation Workflow
- Treat docs in `docs/` and `.cursor/` as source-of-truth artifacts.
- Before major implementation, read:
  1. `docs/project-rules.md`
  2. `PLAN.md`
  3. Relevant docs in `docs/`
- When decisions change, update docs first or in the same task.
- Do not allow code to diverge silently from documented architecture.
- After meaningful work, update `PLAN.md` and affected docs.
- After changes to docs or `PLAN.md`, run `pnpm docs:sync` to regenerate the docs portal content.

## Implementation Sequencing
- Documentation baseline first.
- Monorepo scaffold and tooling second.
- First playable implementation third.
- Stabilization and polish fourth.
- Advanced systems later.

## What Agents Must Avoid
- Do not implement post-MVP systems early.
- Do not introduce architecture that conflicts with shared-world principles.
- Do not add heavy infrastructure without documented need.
- Do not move faster than documentation alignment.
- Do not pre-generate the full world or bypass discovered-spawn constraints.

## Decision Heuristics
When uncertain, choose the option that:
- reaches first playable faster,
- minimizes rewrite cost,
- keeps complexity localized,
- stays understandable for one developer,
- remains testable and debuggable,
- preserves expansion paths.

## Agent and Skills Configuration
- `.cursor/AGENTS.md` – orientation for agents; points to this document.
- `.cursor/agents/` – specialized agents (coder, debugger, planner, product, etc.).
- `.cursor/skills/` – reusable skills (add-component, docs-update, validation, etc.).
- Rules remain in `docs/project-rules.md`; agents and skills reference them.

## Required Living Documents
- `PLAN.md`
- `.cursor/AGENTS.md`
- `docs/README.md`
- `docs/mvp/mvp-scope.md`
- `docs/design/game-design-brief.md`
- `docs/architecture/technical-architecture.md`
- `docs/architecture/diagrams.md`
- `docs/product/implementation-roadmap.md`
- `docs/dev/local-development.md`
- `docs/dev/deployment-strategy.md`
- `docs/ui/storybook-plan.md`

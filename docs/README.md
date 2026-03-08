# Rise Of Civilization Documentation Index

## Purpose
This directory is the documentation source of truth for product scope, architecture decisions, implementation sequencing, and development workflows.

## Status
Active.

## Last Updated
2026-03-06

## Related Documents
- `docs/project-rules.md`
- `.cursor/AGENTS.md`
- `PLAN.md`

## Project Summary
Rise Of Civilization has completed first-playable MVP and the multiplayer realtime foundation.
The runtime now uses stateless Fastify gateway instances with Redis distributed presence/pub-sub and PostgreSQL durable persistence.
Current focus is operations hardening (test coverage, observability, and reliability) following Feature 1.3 (Documentation hub).

## Documentation Purpose
- Keep product and technical decisions explicit and traceable.
- Prevent architecture drift between implementation and planning.
- Provide predictable structure for future HTML portal rendering.

## Reading Order
1. `docs/project-rules.md`
2. `mvp/mvp-scope.md`
3. `design/game-design-brief.md`
4. `architecture/technical-architecture.md`
5. `architecture/diagrams.md`
6. `product/implementation-roadmap.md`
7. `dev/local-development.md`
8. `dev/deployment-strategy.md`
9. `ui/storybook-plan.md`
10. `PLAN.md`

## Document Categories
### Core Governance
- `docs/project-rules.md` - authoritative project rules and implementation guardrails.
- `.cursor/AGENTS.md` - lightweight pointer to the authoritative rule set.
- `PLAN.md` - active execution tracking by feature and priority.

### Product and Scope
- `mvp/mvp-scope.md` - MVP boundaries, acceptance criteria, and shared-world constraints.
- `design/game-design-brief.md` - player-facing design direction for first playable.
- `product/implementation-roadmap.md` - feature sequencing and dependencies.

### Architecture
- `architecture/technical-architecture.md` - system responsibilities and architecture principles.
- `architecture/diagrams.md` - Mermaid diagrams for context, runtime, and data flows.

### Development and Delivery
- `dev/local-development.md` - local environment conventions and operational workflow.
- `dev/deployment-strategy.md` - staging/production deployment strategy and guardrails.
- `ui/storybook-plan.md` - UI component isolation, stories, and interaction test intent.

## Key Locations
- Rules live in `docs/project-rules.md`; agent pointer in `.cursor/AGENTS.md`.
- Agent config: `.cursor/agents/` (specialized agents); `.cursor/skills/` (reusable skills).
- Diagrams live in `docs/architecture/diagrams.md`.
- Roadmap lives in `docs/product/implementation-roadmap.md`.
- MVP scope lives in `docs/mvp/mvp-scope.md`.

## Source of Truth Policy
- Documentation in this repository is authoritative unless explicitly replaced by a newer documented decision.
- If architecture or scope changes, update the affected documentation in the same task.

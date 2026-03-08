# Rise Of Civilization

Shared-world exploration game with deterministic terrain, multiplayer presence, and an internal documentation hub.

## Quick Start

```bash
pnpm install
pnpm docker:reset
```

- **Game client:** http://localhost:5175  
- **Docs portal:** http://localhost:5555  
- **Storybook:** http://localhost:6006  
- **Adminer (DB):** http://localhost:8080  
- **Redis UI:** http://localhost:8081  

## What's New

### Agents & Skills (Cursor)

- **Agents** (`.cursor/agents/`): product, team-lead, coder, devops, documentations, planner, verifier, debugger, test-runner  
- **Skills** (`.cursor/skills/`): add-component, plan-update, validation, docs-update, feature-design, diagrams-create, examples-spec, architecture-design, technical-spec, phase-breakdown, api-implementation, db-migration, fullstack-impl, docker-compose, deployment, ci-cd, docs-collect, docs-platform  
- **Workflow:** `/product` → `/team-lead` → `/coder` → `/planner`  

### Documentation Hub

- Internal docs portal at http://localhost:5555  
- **Hub** tab: features (1, 1.1, 1.2, 1.3) with work items by status (Ahead | In Progress | Done)  
- **Tech** tab: architecture, diagrams (1–10)  
- Azure DevOps–style board with scrollable columns, status-colored cards  
- Modern dark theme, Inter font  

### Feature Structure

- **Feature 1: MVP** – First playable, world, chunk, spawn, save/load, HUD  
- **Feature 1.1: Multiplayer infra** – WebSocket, presence, inspect  
- **Feature 1.2: Redis infra** – Stateless realtime, pub/sub, admin APIs  
- **Feature 1.3: Documentation hub** – Internal docs platform  

### Branch Protection

- `master` is protected: PR required, no direct pushes  
- `enforce_admins: true` – applies to everyone  
- `.github/CODEOWNERS` – @ikiliki auto-assigned as reviewer  

### Mandatory Docker Reset

- After every change, run `pnpm docker:reset` (unless you explicitly skip)  
- Applies to all agents, including `/coder`  

## What Changed

| Area | Before | After |
|------|--------|-------|
| **Rules** | `.cursor/rules/` (RULES.md, AGENTS.md, init-agent-context, docker-reset.mdc) | `docs/project-rules.md`, `.cursorrules`, `.cursor/AGENTS.md`, `.cursor/init-agent-context.md` |
| **Phases** | Milestones 0–9, phases | Features 1, 1.1, 1.2, 1.3 |
| **Docs portal** | Home, Plan, Tech tabs | Hub, Tech tabs only |
| **sync-docs** | `plan.phases`, `extractPhases` | `plan.features`, `extractFeatures` |
| **Tech tab** | Architecture + Technical Solutions | Architecture only |
| **Diagrams** | Unsorted | Sorted 1–10 ascending |
| **Hub layout** | Plan-style board | Azure-style board, scrollable columns |

## What Was Deleted

- `.cursor/rules/` folder (content moved to docs and .cursor)  
- Home tab from docs portal  
- Plan tab from docs portal (Hub replaces it)  
- Technical Solutions tab (duplicate of Architecture)  
- Milestone-based roadmap structure  

## Monorepo Structure

```
apps/client          # React + Vite + R3F game client
apps/server          # Fastify API, WebSocket, Redis
packages/ui          # Shared HUD/components
packages/world-engine # Deterministic chunk/biome logic
packages/shared-types # DTOs
docs-site            # Internal docs portal
docs/                # Documentation source of truth
docker/              # Docker Compose
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm docker:reset` | Down, up, build – run after changes |
| `pnpm docs:sync` | Regenerate docs portal content |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest |
| `pnpm build` | Build all packages |

## Documentation

- **PLAN.md** – Current feature, completed, in progress, next  
- **docs/project-rules.md** – Authoritative rules  
- **docs/README.md** – Doc index and reading order  
- **docs/features/** – Feature specs from `/product`  

## Contributing

1. Create a branch  
2. Make changes  
3. Run `pnpm typecheck && pnpm test && pnpm build`  
4. Run `pnpm docker:reset`  
5. Open a PR to `master`  
6. Merge after review (CODEOWNERS auto-assigns @ikiliki)  

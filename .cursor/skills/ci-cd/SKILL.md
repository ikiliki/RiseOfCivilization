---
name: ci-cd
description: CI/CD pipeline configuration. Use when adding GitHub Actions, build steps, or deploy automation.
---

# CI/CD

Configure GitHub Actions or equivalent for ROC.

## Recommended Pipeline

**On PR:**
- `pnpm install`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- Optional: Storybook build

**On merge to main:**
- Same checks
- Deploy to staging (or production for MVP)
- Run migrations

## Workflow File

`.github/workflows/ci.yml` or similar. Use `pnpm/action-setup` for pnpm. Cache node_modules or pnpm store.

## Conventions

- Fail fast on typecheck/lint
- Run tests before deploy
- Migrations as separate step or pre-deploy hook

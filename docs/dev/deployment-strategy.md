# Deployment Strategy

## Purpose
Define an MVP deployment path that is reliable, low-ops, and aligned with the shared-world persistence model.

## Status
Active strategy for post-MVP multiplayer and operations hardening.

## Last Updated
2026-03-06

## Related Documents
- `docs/architecture/technical-architecture.md`
- `docs/mvp/mvp-scope.md`
- `docs/product/implementation-roadmap.md`
- `.cursor/rules/RULES.md`

## Objective
Use a deployment path that is stable, inexpensive, and maintainable by one developer while keeping a clear upgrade path for growth.

## Solo-Friendly Baseline Path
- Frontend: static hosting with CDN delivery.
- Backend: single container service hosting Fastify API.
- Database: managed PostgreSQL.
- CI/CD: GitHub Actions or equivalent simple pipeline.

This keeps operational burden low while supporting real persistence and API access.

## Staging vs Production Recommendation
- **Staging**: lightweight environment mirroring production shape, smaller instance sizes, seeded test data.
- **Production**: isolated database, stricter secrets handling, controlled deploy gates.
- For MVP, staging can be optional initially but should be added before external playtesting.

## Frontend Hosting Options
- **Preferred**: Vercel or Netlify for fastest static deploy workflow.
- **Alternative**: Cloudflare Pages.

Selection criteria:
- easy environment variable management,
- fast rollback,
- preview deployments per branch.

## Backend Hosting Options
- **Preferred**: Fly.io, Render, or Railway single-service deployment.
- **Alternative**: managed container app on a major cloud if already familiar.

Requirements:
- supports Node.js container deploy,
- private networking or secure DB connection,
- health checks and logs.

## Database Hosting Options
- **Preferred**: Neon, Supabase Postgres, or Render Postgres.
- Keep migrations in repo and run in CI/CD or release step.
- Enforce least-privileged DB credentials per environment.

## CI/CD Recommendations
- On pull request:
  - lint + typecheck + unit tests,
  - optional Storybook build check.
- On main merge:
  - build client + server artifacts,
  - run migrations for target environment,
  - deploy backend then frontend.
- Keep pipeline minimal and deterministic; avoid fragile parallel complexity.

## Rollback Basics
- Frontend rollback: redeploy last known-good build.
- Backend rollback: redeploy previous image tag.
- Schema rollback: prefer forward-fix migrations; avoid destructive rollback scripts unless tested.
- Keep release notes per deploy with version/date/owner.

## Secrets Basics
- Never commit real secrets.
- Use platform secret managers for:
  - `DATABASE_URL`
  - `AUTH_TOKEN_SECRET`
  - environment-specific API keys.
- Rotate secrets on incident or scheduled cadence.
- Keep `.env.example` sanitized and current.

## Operational Guardrails for MVP
- Set uptime/error alerts at basic threshold (5xx spikes, DB connectivity failure).
- Add structured logs on backend requests and failures.
- Define one "known good" deployment checklist before each production push.
- Prefer fewer deploys with validation over frequent unverified releases.
- Protect shared-world data integrity during migrations and releases.

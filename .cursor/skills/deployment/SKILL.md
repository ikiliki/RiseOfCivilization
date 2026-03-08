---
name: deployment
description: Deployment strategy and production config. Use when setting up staging, production, or CI/CD.
---

# Deployment

See `docs/dev/deployment-strategy.md` for full strategy.

## Baseline

- **Frontend**: Static hosting (Vercel, Netlify, Cloudflare Pages)
- **Backend**: Container (Fly.io, Render, Railway)
- **DB**: Managed PostgreSQL (Neon, Supabase, Render)
- **CI/CD**: GitHub Actions

## Key Tasks

1. **Dockerfile** – Production-ready build (multi-stage, minimal image)
2. **Environment** – Secrets, DATABASE_URL, REDIS_URL
3. **Health checks** – /health or equivalent
4. **Migrations** – Run in CI or release step

## Conventions

- No secrets in repo
- Migrations in version control
- Staging before production
- Rollback path documented

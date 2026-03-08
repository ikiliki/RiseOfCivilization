---
name: docker-compose
description: Configure Docker Compose services. Use when adding services, changing ports, or updating docker/compose.yml.
---

# Docker Compose

Manage `docker/compose.yml` for ROC local stack.

## Current Services

- `postgres` – PostgreSQL 16, port 5432
- `redis` – Redis 7, port 6379
- `adminer` – DB UI, port 8080
- `redis-ui` – Redis Commander, port 8081
- `server` – Fastify API, port 4001
- `client` – Vite dev, port 5175
- `storybook` – UI dev, port 6006
- `docs-site` – Docs portal, port 5555

## Conventions

- Use `depends_on` with `condition: service_healthy` for DB/Redis
- Healthchecks for postgres, redis
- Build context `..` (repo root) for app Dockerfiles
- Volumes for persistent data (roc_postgres_data)
- Environment vars for DATABASE_URL, REDIS_URL, etc.

## Adding a Service

```yaml
new-service:
  build:
    context: ..
    dockerfile: path/to/Dockerfile
  ports:
    - "PORT:PORT"
  depends_on:
    postgres:
      condition: service_healthy
  environment:
    VAR: value
```

## Commands

- `pnpm docker:reset` – Down, up, build
- `pnpm docker:up` – Up with build
- `pnpm docker:down` – Down with volumes

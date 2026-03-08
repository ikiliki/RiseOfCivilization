---
name: api-implementation
description: Implement backend API with Fastify. Use when adding REST endpoints, WebSocket handlers, or server logic.
---

# API Implementation

Implement backend API in `apps/server` using Fastify.

## Structure

- Routes: `apps/server/src/routes/`
- Handlers: co-located or `apps/server/src/handlers/`
- Services: `apps/server/src/services/`
- Shared types: `packages/shared-types`

## Patterns

```typescript
// Route registration
fastify.get('/api/example/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const result = await exampleService.get(id);
  return result;
});
```

## Conventions

- Use `request.params`, `request.body` with typed interfaces
- Return JSON; use reply.code() for errors
- Add to Swagger if applicable (decorate routes)
- Validate input (e.g. schema validation)

## Database

- Use existing DB client/pool
- Migrations in `apps/server/migrations/` (see db-migration skill)
- No raw SQL in routes; use repository/service layer

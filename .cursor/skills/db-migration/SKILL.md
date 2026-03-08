---
name: db-migration
description: Create PostgreSQL migrations and schema changes. Use when adding tables, columns, or indexes.
---

# Database Migration

Create PostgreSQL migrations for ROC.

## Location

Migrations live in `apps/server/migrations/`. Naming: `001_initial.sql`, `002_add_table.sql` (numbered, run in order).

## Migration Format

```sql
-- Migration: Add player_inventory table
-- Up
CREATE TABLE IF NOT EXISTS player_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id),
  item_id TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_player_inventory_player ON player_inventory(player_id);

-- Down (optional, for rollback)
-- DROP TABLE IF EXISTS player_inventory;
```

## Conventions

- Use `users` for auth; reference by `player_id` or `user_id` as per schema
- Timestamps: `created_at`, `updated_at` with `TIMESTAMPTZ`
- Indexes for foreign keys and frequent queries
- Run migrations via project script (e.g. `pnpm db:migrate` or docker)

---
name: docs-update
description: Update documentation and sync docs portal content. Use when changing docs, PLAN.md, architecture, roadmap, or when the user asks to update documentation.
---

# Docs Update

Update documentation and regenerate docs portal content when docs change.

## When to Run docs:sync

Run `pnpm docs:sync` after changes to:

- `PLAN.md`
- Any file in `docs/` (mvp, design, architecture, dev, product, ui)
- `.cursor/AGENTS.md` or `docs/project-rules.md` if it affects documented behavior

## Command

```bash
pnpm docs:sync
```

This runs `node docs-site/sync-docs.mjs` and regenerates `docs-site/content.generated.js`.

## Source of Truth

Documentation lives in:

| Location | Content |
|----------|---------|
| `docs/` | Product, architecture, dev, roadmap |
| `PLAN.md` | Current phase, completed, in progress, next |
| `docs/project-rules.md` | Authoritative project rules |

## Rules

- Update docs in the same task as code changes when decisions change.
- Do not let code diverge from documented architecture.
- Before major implementation, read `docs/project-rules.md`, `PLAN.md`, and relevant docs.
- Keep docs concise; avoid duplicating what code already expresses.

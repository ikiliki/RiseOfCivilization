---
name: validation
description: Run typecheck, lint, test, and build validation for Rise Of Civilization. Use when validating changes, before committing, or when the user asks to run tests, typecheck, lint, or build.
---

# Validation

Run project validation commands and Docker reset per project rules.

## Commands

From repository root:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Run these after implementation work to confirm nothing is broken.

## Docker Reset

**Mandatory after every change.** Run `pnpm docker:reset` yourself. All agents (including /coder) must do this.

```bash
pnpm docker:reset
```

Only skip if the user explicitly says "don't reset Docker" or "skip docker reset".

## Typical Flow

1. Make changes
2. Run `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
3. **Run `pnpm docker:reset`** (mandatory)
4. If docs or PLAN.md changed, run `pnpm docs:sync`

## Skip Docker Reset When

- User says "don't reset Docker" or "skip docker reset"
- Change is docs-only and user confirms skip
- Change does not touch client, server, packages, or docker config

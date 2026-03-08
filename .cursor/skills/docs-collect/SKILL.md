---
name: docs-collect
description: Collect and organize documentation from docs/, PLAN.md, and .cursor. Use when gathering docs for the platform or ensuring all sources are included.
---

# Docs Collect

Collect documentation sources for the internal docs platform.

## Sources (sync-docs.mjs)

- `docs/README.md`
- `docs/project-rules.md`
- `docs/mvp/mvp-scope.md`
- `docs/design/game-design-brief.md`
- `docs/architecture/technical-architecture.md`
- `docs/architecture/diagrams.md`
- `docs/dev/local-development.md`
- `docs/dev/deployment-strategy.md`
- `docs/ui/storybook-plan.md`
- `docs/product/implementation-roadmap.md`
- `PLAN.md`
- `docs/features/*.md` (if exists)

## Adding a Source

Edit `docs-site/sync-docs.mjs` sources array:

```js
{ key: "newDoc", path: "docs/path/to/doc.md" },
```

Then add extraction logic if needed (phases, work items, etc.). Run `pnpm docs:sync`.

## Output

`docs-site/content.generated.js` – Injected into the platform at runtime.

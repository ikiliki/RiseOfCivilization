---
name: docs-platform
description: Build and maintain the internal docs backoffice platform. Use when implementing or improving the docs portal UI.
---

# Docs Platform

Build the internal documentation backoffice at `docs-site/`.

## Stack

- React, TypeScript, Vite
- Markdown rendering (e.g. react-markdown)
- Mermaid for diagrams
- Content from `content.generated.js` (via `pnpm docs:sync`)

## Structure

- `docs-site/src/` – React app
- `docs-site/sync-docs.mjs` – Generates content from docs
- `docs-site/content.generated.js` – Injected into app
- Docker: port 5555

## Conventions

- Backoffice style: clean, navigable, search-friendly
- Sections: Plan, MVP, Architecture, Dev, Features
- Feature/task board for execution visibility
- Responsive, readable typography

## Implementation

- Add components with `.styles.css` and stories (per add-component skill)
- Use `loadPortalContent()` from content.generated.js
- Run `pnpm docs:sync` after doc changes
- Add to `docker/compose.yml` docs-site service

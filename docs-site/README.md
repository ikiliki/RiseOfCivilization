# Docs Portal (Local)

## What this is
This folder contains a lightweight internal documentation portal for **Rise Of Civilization**.
It is now a client-only **React + TypeScript + Vite** app for browsing project docs quickly during planning and implementation.

This is **not** the game client UI and does not affect runtime game code.

## How to open it
1. From repo root, run:
   - `pnpm docs:sync`
   - `pnpm docs:dev`
2. Open the Vite URL shown in the terminal.

No backend is required.

## Useful scripts
- `pnpm docs:sync`: regenerate `content.generated.js` from repository docs.
- `pnpm docs:dev`: run the React docs portal locally.
- `pnpm docs:build`: build the portal into `docs-site/dist/`.
- `pnpm docs:storybook`: run Storybook for the docs portal section components.

## Docker
The docs portal is also available in Docker Compose.

- Start full stack: `pnpm docker:up`
- Reset and rebuild full stack: `pnpm docker:reset`
- Docs portal URL in Docker: `http://localhost:5555`

## File structure
- `index.html`: layout and script/style wiring.
- `styles.css`: shared visual style, responsive layout, cards, and navigation styling.
- `src/App.tsx`: top-level portal shell, navigation, and section composition.
- `src/pages/*`: one React section component per portal menu item.
- `src/components/*`: shared React UI pieces such as shell, markdown, Mermaid, nav, and task cards.
- `sync-docs.mjs`: reads source markdown docs and generates portal content.
- `content.generated.js`: generated data payload used by the portal.
- `.storybook/*`: local Storybook config for section component development.

## Mermaid handling
- Raw Mermaid text is shown in copyable code blocks.
- A "Copy Mermaid" button is included for each diagram.
- Mermaid is rendered in React using the `mermaid` package.

## How to update later
1. Update the markdown docs under `docs/` and `PLAN.md`.
2. Run `pnpm docs:sync` to regenerate `content.generated.js`.
3. For portal UI changes, edit the React components under `src/pages` and `src/components`.
4. For new sections, add a section component, a co-located style file, a co-located story, and wire it into `src/App.tsx`.
5. If source data changes, keep the same output shape from `sync-docs.mjs`.

## Suggested doc format standard
For easier long-term automation, keep each markdown file in this structure:
- `# Title`
- `## Purpose`
- `## Status`
- `## Last Updated`
- `## Related Documents`
- Main content sections using consistent `##` headings and bullet lists.

This is already close to current docs and works well with the sync script.

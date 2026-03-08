# AGENTS

## Purpose
Provide a lightweight orientation note for agents working in this repository.

## Status
Active.

## Last Updated
2026-03-06

## Authoritative Rules Location
All authoritative agent rules live in `docs/project-rules.md`.

## Repository Context
Rise Of Civilization is currently a planning-and-architecture repository for MVP execution.
Agents should prioritize documentation alignment, MVP boundaries, and shared-world constraints before implementation work.

## Docs Portal Sync
- After any change to markdown docs or `PLAN.md` that affects the docs portal, run `pnpm docs:sync` (or `node docs-site/sync-docs.mjs`) to regenerate `content.generated.js`.
- Agents should run this sync after each implementation run that touches docs or plan files.

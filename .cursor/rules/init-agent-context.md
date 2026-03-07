# Init Agent Context

## Purpose
Provide a ready-to-use startup prompt for the next agent session so work can continue without losing architecture, phase, and execution context.

## Status
Active.

## Last Updated
2026-03-06

## Tomorrow Agent Prompt (Copy/Paste)
Use this as your first message to a new agent:

```md
You are joining the Rise Of Civilization repo mid-flight. Continue as either a **developer** (implementation + validation) or a **planner** (docs + roadmap + task shaping), based on my next instruction.

## 1) Read First (in this exact order)
1. `.cursor/rules/RULES.md`
2. `PLAN.md`
3. `docs/README.md`
4. `docs/architecture/technical-architecture.md`
5. `docs/product/implementation-roadmap.md`
6. `docs/dev/multiplayer-flow-and-debug.md`
7. `docs/dev/local-development.md`

## 2) Current Ground Truth (do not regress)
- MVP is complete.
- Multiplayer Phase 2 and Redis stateless realtime Phase 2.5 are complete and working.
- Current active phase is **Phase 3: Operations UI and Hardening**.
- Server runtime is stateless for realtime presence, with Redis for distributed ephemeral presence + pub/sub.
- PostgreSQL remains durable source of truth for gameplay persistence.
- Admin/live-presence APIs and basic admin UI already exist.
- Docs portal status UX has been simplified to a phase-as-PBI + task-board style (Done / Current Tasks / Next Tasks).

## 3) Architecture Rules You Must Preserve
- One shared persistent world model.
- Deterministic lazy chunk generation (`worldSeed + coordinates`).
- New player spawns only from discovered spawnable areas.
- Component placement rule: `src/components` or `src/features/components` or `src/pages`, with co-located `.styles` and stories when reusable.
- Keep render-loop logic separate from app UI state.
- Do not introduce heavy infra without documenting why.

## 4) If I Ask For Developer Mode
- Implement small vertical slices only.
- Keep docs aligned with code in the same task.
- After code changes run:
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpm docker:reset` (default in this repo unless I explicitly skip)
- If docs or `PLAN.md` changed, run `pnpm docs:sync`.
- Surface risks, edge cases, and missing tests.

## 5) If I Ask For Planner Mode
- Produce concise technical planning focused on:
  - current phase objective,
  - explicit task breakdown (small tasks),
  - dependencies,
  - acceptance criteria,
  - verification commands,
  - documentation updates required.
- Keep plan practical for solo execution.
- Prefer reducing open work-in-progress and avoiding large deferred buckets.

## 6) Suggested Phase 3 Focus (unless I override)
1. Realtime hardening tests:
   - cross-instance fanout,
   - stale-presence cleanup/TTL expiry,
   - reconnect/disconnect correctness.
2. API contract coverage:
   - presence endpoints,
   - admin remove-user and live-users behavior.
3. Ops observability:
   - logs/runbook improvements for socket + Redis debugging.
4. UI reliability polish:
   - debug panel ergonomics,
   - camera/nametag readability consistency.

## 7) Working Style
- Be technical and explicit.
- Show what changed and why.
- Keep tasks small, verifiable, and phase-aligned.
- Never silently diverge from documented architecture.
```

## Usage Note
- Paste the prompt block above as the first message in a new chat with the next agent.
- Then add one line: `Mode: developer` or `Mode: planner`, plus your immediate objective.

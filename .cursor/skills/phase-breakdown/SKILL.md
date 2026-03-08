---
name: phase-breakdown
description: Break feature into implementable tasks. Use when creating task lists for PLAN.md or sprint planning.
---

# Feature Breakdown

Break feature into small, implementable tasks.

## Output

Update feature doc with `## Implementation Tasks` and/or update `PLAN.md` In Progress / Next.

## Task Format

Each task:
- Single vertical slice (one deployable unit)
- Clear acceptance: "done when X works"
- 1–3 days max for solo dev
- Dependency-ordered

## Example

```markdown
## Implementation Tasks

1. **DB: Add `player_inventory` table** – Migration, schema
2. **API: POST /api/inventory/add** – Endpoint, validation
3. **Client: InventoryPanel component** – UI, API call
4. **Integration: Wire panel to HUD** – Connect, test
```

## PLAN.md Integration

- Add to In Progress when starting
- Move to Completed when done
- Keep Next as backlog

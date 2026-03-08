---
name: plan-update
description: Update PLAN.md with completed work, in-progress items, and next steps. Use when finishing tasks, starting work, or when the user asks to update the plan, track progress, or update status.
---

# Plan Update

Update `PLAN.md` to keep execution status accurate. The plan lives at repository root.

## When to Update

- After completing meaningful work (move items from In Progress → Completed)
- When starting new work (add to In Progress, move from Next if applicable)
- When priorities change (adjust Next, Blocked)
- When phase changes (update Current Phase)

## Structure

`PLAN.md` sections:

| Section | Purpose |
|---------|---------|
| **Current Feature** | Single bullet: e.g. `Feature 1.3: Documentation hub` |
| **Completed** | Bullet list of done items (no sub-tasks) |
| **In Progress** | Bullet list; items can have `  - ` sub-tasks |
| **Next** | Bullet list of upcoming work |
| **Blocked** | Items waiting on something |

## Format

### Completed

```markdown
## Completed
- Item one (short descriptive line).
- Item two.
```

### In Progress (with sub-tasks)

```markdown
## In Progress
- Operations hardening (operations + quality hardening).
  - [ ] Add integration tests for cross-instance fanout.
  - [ ] Add API-level coverage for admin endpoints.
```

### Next

```markdown
## Next
- Operations board and observability polish:
  - Simplify docs portal status board.
  - Add runbook snippets for Redis presence troubleshooting.
```

## Rules

- Keep items concise and actionable.
- Completed items stay as single bullets (no sub-tasks).
- In Progress and Next can use sub-tasks for clarity.
- Preserve existing formatting and related-document links.
- Update **Last Updated** date when editing.

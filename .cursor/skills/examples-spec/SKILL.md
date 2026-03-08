---
name: examples-spec
description: Add concrete examples, wireframes, and mockup references to feature specs. Use when specifying UI behavior, edge cases, or design examples.
---

# Examples and Specs

Add concrete examples to feature documents.

## What to Include

1. **Happy path examples** – Typical user scenarios with expected outcomes
2. **Edge cases** – Empty state, error state, boundary conditions
3. **UI examples** – Layout, copy, interaction (ASCII or Figma link)
4. **API examples** – Request/response samples if feature has API surface

## Format

```markdown
## Examples

### Happy Path
- User opens settings → sees keybinding list → clicks "WASD" → presses new key → binding updates

### Edge Cases
- Empty keybinding: show "Not set"
- Conflict: show warning, highlight both rows

### UI Mock
[Figma: Settings Modal](link) or:
```
+------------------+
| Keybindings      |
| Move: [W A S D]  |
| Jump: [Space]    |
+------------------+
```
```

## Figma

- Prefer Figma links for visual design
- Add `## Design` section with link and brief description of key screens

---
name: feature-design
description: Document feature or phase design with acceptance criteria, user flows, and scope. Use when designing a new feature, phase, or product request.
---

# Feature Design

Document feature/phase design for handoff to team lead and coder.

## Output Location

Create or update in `docs/features/<feature-name>.md` or `docs/product/` as appropriate.

## Required Sections

1. **Purpose** – Why this feature/phase exists
2. **Scope** – In scope / out of scope
3. **User flows** – Step-by-step user journeys
4. **Acceptance criteria** – Testable conditions for done
5. **Examples** – Concrete examples, edge cases
6. **Figma / mockups** – Links to Figma, wireframes, or ASCII mockups
7. **Diagrams** – Mermaid flowcharts for user flows (see diagrams-create skill)

## Figma Integration

- Add Figma link in a dedicated section: `## Design`
- Use format: `[Figma: Feature Name](https://figma.com/...)`
- If no Figma, provide ASCII wireframe or bullet-point layout description

## Example Structure

```markdown
# Feature: [Name]

## Purpose
[One paragraph]

## Scope
### In Scope
- Item 1
### Out of Scope
- Item 1

## User Flows
1. User does X → System does Y
2. ...

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Examples
- Example 1: When user X, show Y
- Edge case: ...

## Design
[Figma link or wireframe]

## Diagrams
[Link to docs/architecture/diagrams.md or inline Mermaid]
```

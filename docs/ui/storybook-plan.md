# Storybook Plan

## Purpose
Use Storybook to build and validate reusable UI/HUD components in isolation, while keeping the 3D game world outside Storybook.

## Status
Active for ongoing UI workflow (MVP complete, multiplayer tooling active).

## Last Updated
2026-03-06

## Related Documents
- `docs/design/game-design-brief.md`
- `docs/mvp/mvp-scope.md`
- `docs/architecture/technical-architecture.md`
- `docs/project-rules.md`

## What Belongs in Storybook
- HUD shell components (top bar, status panel, utility controls).
- Settings modal and sub-panels.
- Keybinding list rows and capture controls.
- Buttons, toggles, sliders, selects, tabs.
- Notification/toast and dialog patterns.
- Data display widgets (stats, currency placeholders, coordinates readout).
- Feature 1.1 inspect/profile panel UI components for player presence workflows.

## What Does Not Belong in Storybook
- Full world rendering loop.
- Chunk streaming pipeline.
- Player movement simulation.
- Camera controller integration.

Storybook is for UI components, not for end-to-end gameplay runtime.

## Component Categories
- `Layout`: HUD containers, panel wrappers, modal shells.
- `Input`: button, toggle, slider, key-capture field.
- `Feedback`: toast, inline errors, loading states.
- `Domain`: settings sections, keybind rows, profile mini-cards.
- `Overlays`: pause/settings/help modal variants.

## Story Conventions
- One default story per component with realistic props.
- Add edge-case stories for:
  - empty data,
  - long text labels,
  - error state,
  - loading/disabled states.
- Use deterministic mock data from shared fixtures.
- Name stories by behavior, not by ticket id.

## Viewport Strategy
- Desktop-first MVP, but test practical widths:
  - 1366x768 (common laptop),
  - 1920x1080 (standard desktop),
  - 2560x1440 (high-res desktop).
- Include one narrow-width resilience story for modal/panel overflow checks.

## Interaction Testing Ideas
- Keybinding capture flow (open capture -> press key -> conflict warning).
- Settings apply/cancel/reset behavior.
- Modal keyboard navigation and escape-close behavior.
- HUD button tooltips and disabled behavior.

Use Storybook interaction tests for critical UI flows where failures are likely.

## Separation Between Game Canvas and App UI
- Game canvas remains in `apps/client`.
- Storybook sources UI from `packages/ui` (and shared types as needed).
- UI components receive data through props/interfaces; no direct world-engine coupling.
- Keep render loop state out of reusable UI package.

## Styling and Placement Conventions
Per project rule, each component should live in its proper place:
- `src/components`
- `src/features/components`
- `src/pages`

Each component should include:
- co-located `*.styles` file,
- co-located story file,
- clean separation between presentational and behavioral concerns.

## MVP Success Criteria for Storybook
- All HUD/settings/keybinding primitives have stories.
- Storybook runs independently from world rendering runtime.
- Core interactions are covered by at least minimal interaction tests.
- UI changes can be verified visually without launching full game client.

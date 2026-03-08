---
name: add-component
description: Add new React/UI components following Rise Of Civilization conventions. Use when creating components, adding UI elements, or when the user asks to add a component, feature component, or page component.
---

# Add Component

Add React components following project placement and styling conventions.

## Placement

Place components in one of:

| Location | Use for |
|----------|---------|
| `packages/ui/src/components/` | Reusable HUD/app UI shared across apps |
| `packages/ui/src/features/components/` | Feature-specific UI (settings, keybinding, inspect, etc.) |
| `apps/client/src/components/` | Client-only game UI (scene, panels, avatars) |
| `apps/client/src/pages/` | Page-level components |

## Required Files

Each component needs:

1. **Component file** – `ComponentName.tsx` (or `.js` if legacy)
2. **Styles file** – `ComponentName.styles.css` next to the component
3. **Stories** – `ComponentName.stories.tsx` for reusable/Storybook components

## File Structure

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.styles.css
└── ComponentName.stories.tsx   # for reusable components
```

## Patterns

### Component

```tsx
import './ComponentName.styles.css';

interface ComponentNameProps {
  // props
}

export function ComponentName({ ... }: ComponentNameProps) {
  return (
    <div className="roc-component-name">
      {/* content */}
    </div>
  );
}
```

### Styles

Use `roc-` prefix for class names to avoid collisions. Example: `roc-button`, `roc-keybind-row`, `roc-keybind-row--conflict`.

### Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: { /* props */ }
};
```

## Notes

- Storybook is for UI/HUD components in `packages/ui`, not world simulation runtime.
- Use TypeScript with strict typing; avoid `any`.
- Keep domain logic out of presentational components.
- If adding to `packages/ui`, export from `packages/ui/src/index.ts` if it should be public.

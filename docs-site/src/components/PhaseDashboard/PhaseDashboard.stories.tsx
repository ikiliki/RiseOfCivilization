import type { Meta, StoryObj } from '@storybook/react';
import { PhaseDashboard } from './PhaseDashboard';

const meta = {
  title: 'Components/PhaseDashboard',
  component: PhaseDashboard
} satisfies Meta<typeof PhaseDashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    phases: [
      {
        id: 'mvp',
        title: 'Milestone 6: First Playable Stabilization',
        summary: 'Performance pass and bug fixes for the MVP shell.',
        status: 'done',
        bullets: ['Performance pass', 'HUD polish', 'Smoke tests']
      },
      {
        id: 'phase-2',
        title: 'Milestone 7: Phase 2 Multiplayer Foundation',
        summary: 'Realtime presence and inspect loop shipped.',
        status: 'done',
        bullets: ['WebSocket layer', 'Presence sync', 'Inspect panel']
      },
      {
        id: 'phase-3',
        title: 'Milestone 9: Phase 3 Operations UI and Hardening',
        summary: 'Improve ops workflows, coverage, and docs visibility.',
        status: 'active',
        bullets: ['Integration coverage', 'Runbooks', 'Docs portal simplification']
      }
    ]
  }
};

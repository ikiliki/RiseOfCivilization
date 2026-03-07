import type { Meta, StoryObj } from '@storybook/react';
import { HudShell } from './HudShell';

const meta: Meta<typeof HudShell> = {
  title: 'Pages/HudShell',
  component: HudShell
};

export default meta;
type Story = StoryObj<typeof HudShell>;

export const Default: Story = {
  args: {
    username: 'ikiliki',
    skinColor: '#8b5a2b',
    currency: 120,
    energy: 100,
    hydration: 80,
    onOpenSettings: () => {}
  }
};

export const WithoutPlayer: Story = {
  args: {
    currency: 120,
    energy: 100,
    hydration: 80,
    onOpenSettings: () => {}
  }
};

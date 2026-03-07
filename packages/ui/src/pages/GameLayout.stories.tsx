import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GameLayout } from './GameLayout';
import { MockMap } from './MockMap';

const meta: Meta<typeof GameLayout> = {
  title: 'Pages/GameLayout',
  component: GameLayout,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', minHeight: 500 }}>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof GameLayout>;

const defaultArgs = {
  username: 'ikiliki',
  skinColor: '#8b5a2b',
  currency: 120,
  energy: 100,
  hydration: 80,
  saveFeedback: 'Connected',
  connected: true
};

export const Default: Story = {
  render: (args) => (
    <GameLayout {...args}>
      <MockMap />
    </GameLayout>
  ),
  args: defaultArgs
};

export const Autosaved: Story = {
  render: (args) => (
    <GameLayout {...args}>
      <MockMap />
    </GameLayout>
  ),
  args: { ...defaultArgs, saveFeedback: 'Autosaved' }
};

export const Offline: Story = {
  render: (args) => (
    <GameLayout {...args}>
      <MockMap />
    </GameLayout>
  ),
  args: { ...defaultArgs, connected: false, saveFeedback: 'Save failed' }
};

export const WithInspectPanel: Story = {
  render: (args) => (
    <GameLayout {...args}>
      <MockMap />
    </GameLayout>
  ),
  args: {
    ...defaultArgs,
    inspectOpen: true,
    inspectProfile: {
      userId: 'usr-abc123',
      username: 'ikiliki',
      position: { x: 12, y: 0, z: -5 },
      currency: 250,
      stats: { energy: 85, hydration: 70 },
      chunkX: 0,
      chunkY: 0,
      biome: 'grassland',
      skinColor: '#8b5a2b'
    },
    inspectLoading: false,
    onCloseInspect: fn()
  }
};

export const InspectLoading: Story = {
  render: (args) => (
    <GameLayout {...args}>
      <MockMap />
    </GameLayout>
  ),
  args: {
    ...defaultArgs,
    inspectOpen: true,
    inspectProfile: null,
    inspectLoading: true,
    onCloseInspect: fn()
  }
};

export const WithSettingsOpen: Story = {
  render: (args) => (
    <GameLayout {...args}>
      <MockMap />
    </GameLayout>
  ),
  args: {
    ...defaultArgs,
    settingsOpen: true,
    onOpenSettings: fn(),
    onCloseSettings: fn(),
    onLogout: fn()
  }
};

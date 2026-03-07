import type { Meta, StoryObj } from '@storybook/react';
import { PlayerInspectPanel } from './PlayerInspectPanel';

const meta: Meta<typeof PlayerInspectPanel> = {
  component: PlayerInspectPanel,
  title: 'Features/PlayerInspectPanel'
};

export default meta;

type Story = StoryObj<typeof PlayerInspectPanel>;

export const Default: Story = {
  args: {
    open: true,
    profile: {
      userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      username: 'Explorer42',
      position: { x: 24, y: 0, z: 16 },
      currency: 1250,
      stats: { energy: 85, hydration: 72 },
      chunkX: 1,
      chunkY: 1,
      biome: 'grassland'
    },
    loading: false,
    onClose: () => {}
  }
};

export const Loading: Story = {
  args: {
    open: true,
    profile: null,
    loading: true,
    onClose: () => {}
  }
};

export const Empty: Story = {
  args: {
    open: true,
    profile: null,
    loading: false,
    onClose: () => {}
  }
};

export const DesertBiome: Story = {
  args: {
    open: true,
    profile: {
      userId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      username: 'DesertWanderer',
      position: { x: -48, y: 0, z: 32 },
      currency: 500,
      stats: { energy: 60, hydration: 40 },
      chunkX: -3,
      chunkY: 2,
      biome: 'desert'
    },
    loading: false,
    onClose: () => {}
  }
};

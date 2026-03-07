import type { Meta, StoryObj } from '@storybook/react';
import { PlayerCard } from './PlayerCard';

const meta: Meta<typeof PlayerCard> = {
  title: 'Components/PlayerCard',
  component: PlayerCard
};

export default meta;
type Story = StoryObj<typeof PlayerCard>;

export const Default: Story = {
  args: {
    username: 'ikiliki',
    skinColor: '#8b5a2b'
  }
};

export const GreenSkin: Story = {
  args: {
    username: 'ikiliki1',
    skinColor: '#4f9d69'
  }
};

export const NoSkin: Story = {
  args: {
    username: 'explorer'
  }
};

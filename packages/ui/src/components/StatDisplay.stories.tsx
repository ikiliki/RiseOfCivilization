import type { Meta, StoryObj } from '@storybook/react';
import { StatDisplay } from './StatDisplay';

const meta: Meta<typeof StatDisplay> = {
  title: 'Components/StatDisplay',
  component: StatDisplay
};

export default meta;
type Story = StoryObj<typeof StatDisplay>;

export const Energy: Story = {
  args: {
    label: 'Energy',
    value: 100
  }
};

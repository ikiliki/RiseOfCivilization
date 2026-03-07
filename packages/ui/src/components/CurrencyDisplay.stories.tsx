import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyDisplay } from './CurrencyDisplay';

const meta: Meta<typeof CurrencyDisplay> = {
  title: 'Components/CurrencyDisplay',
  component: CurrencyDisplay
};

export default meta;
type Story = StoryObj<typeof CurrencyDisplay>;

export const Default: Story = {
  args: {
    amount: 250
  }
};

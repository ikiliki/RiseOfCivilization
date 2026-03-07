import type { Meta, StoryObj } from '@storybook/react';
import { KeybindingRow } from './KeybindingRow';

const meta: Meta<typeof KeybindingRow> = {
  title: 'Features/KeybindingRow',
  component: KeybindingRow
};

export default meta;
type Story = StoryObj<typeof KeybindingRow>;

export const Normal: Story = {
  args: {
    action: 'Move Forward',
    keyValue: 'KeyW',
    onStartCapture: () => {}
  }
};

export const Conflict: Story = {
  args: {
    action: 'Move Left',
    keyValue: 'KeyW',
    conflict: true,
    onStartCapture: () => {}
  }
};

import type { Meta, StoryObj } from '@storybook/react';
import { EmbeddedMermaid } from './EmbeddedMermaid';

const meta = {
  title: 'Components/EmbeddedMermaid',
  component: EmbeddedMermaid
} satisfies Meta<typeof EmbeddedMermaid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    code: 'flowchart LR\n  Client --> Server\n  Server --> Redis\n  Server --> PostgreSQL'
  }
};

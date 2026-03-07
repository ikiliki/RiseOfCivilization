import type { Meta, StoryObj } from '@storybook/react';
import { WikiDocument } from './WikiDocument';
import { mockContent } from '../../lib/mockContent';

const meta = {
  title: 'Components/WikiDocument',
  component: WikiDocument
} satisfies Meta<typeof WikiDocument>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'design',
    title: 'Design',
    sourceLabel: 'docs/design/game-design-brief.md',
    markdown: mockContent.docs.design
  }
};

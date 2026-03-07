import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { LocalDevSection } from './LocalDevSection';

const meta = {
  title: 'Pages/LocalDevSection',
  component: LocalDevSection,
  args: {
    markdown: mockContent.docs.localDev,
    sourceLabel: mockContent.sources.localDev
  }
} satisfies Meta<typeof LocalDevSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

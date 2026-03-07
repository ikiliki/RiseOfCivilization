import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { DesignSection } from './DesignSection';

const meta = {
  title: 'Pages/DesignSection',
  component: DesignSection,
  args: {
    markdown: mockContent.docs.design,
    sourceLabel: mockContent.sources.design
  }
} satisfies Meta<typeof DesignSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

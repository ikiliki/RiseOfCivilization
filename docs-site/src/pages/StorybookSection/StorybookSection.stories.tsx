import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { StorybookSection } from './StorybookSection';

const meta = {
  title: 'Pages/StorybookSection',
  component: StorybookSection,
  args: {
    iframeUrl: 'about:blank',
    markdown: mockContent.docs.storybook,
    sourceLabel: mockContent.sources.storybook
  }
} satisfies Meta<typeof StorybookSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

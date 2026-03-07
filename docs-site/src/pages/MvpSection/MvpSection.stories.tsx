import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { MvpSection } from './MvpSection';

const meta = {
  title: 'Pages/MvpSection',
  component: MvpSection,
  args: {
    markdown: mockContent.docs.mvp,
    sourceLabel: mockContent.sources.mvp
  }
} satisfies Meta<typeof MvpSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    markdown: ''
  }
};

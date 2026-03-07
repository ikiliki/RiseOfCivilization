import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { ArchitectureSection } from './ArchitectureSection';

const meta = {
  title: 'Pages/ArchitectureSection',
  component: ArchitectureSection,
  args: {
    markdown: mockContent.docs.architecture,
    sourceLabel: mockContent.sources.architecture
  }
} satisfies Meta<typeof ArchitectureSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

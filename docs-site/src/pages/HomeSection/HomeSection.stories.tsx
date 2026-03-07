import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { HomeSection } from './HomeSection';

const meta = {
  title: 'Pages/HomeSection',
  component: HomeSection,
  args: {
    phase: mockContent.planStatus.phase,
    planStatus: mockContent.planStatus,
    projectSummary:
      'Rise Of Civilization is in active implementation with a shared world and multiplayer foundation work.',
    roadmapMarkdown: mockContent.docs.roadmap,
    sourceLabel: mockContent.sources.docsReadme
  }
} satisfies Meta<typeof HomeSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

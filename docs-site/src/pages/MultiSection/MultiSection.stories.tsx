import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { MultiSection } from './MultiSection';

const meta = {
  title: 'Pages/MultiSection',
  component: MultiSection,
  args: {
    architectureMarkdown: mockContent.docs.architecture,
    multiSubSteps: mockContent.multiSubSteps ?? [],
    planStatus: mockContent.planStatus,
    roadmapMarkdown: mockContent.docs.roadmap,
    sourceLabel:
      'PLAN.md + docs/architecture/technical-architecture.md + docs/product/implementation-roadmap.md'
  }
} satisfies Meta<typeof MultiSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    multiSubSteps: [],
    architectureMarkdown: '# Architecture\n\n## Phase 2 Multiplayer (Implemented)\n',
    roadmapMarkdown: '# Roadmap\n'
  }
};

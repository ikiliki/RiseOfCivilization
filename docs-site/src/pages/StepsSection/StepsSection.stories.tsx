import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { StepsSection } from './StepsSection';

const meta = {
  title: 'Pages/StepsSection',
  component: StepsSection,
  args: {
    planStatus: mockContent.planStatus,
    roadmapMarkdown: mockContent.docs.roadmap,
    sourceLabel: 'PLAN.md + docs/product/implementation-roadmap.md'
  }
} satisfies Meta<typeof StepsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

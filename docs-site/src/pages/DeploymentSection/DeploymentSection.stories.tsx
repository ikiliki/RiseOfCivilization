import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { DeploymentSection } from './DeploymentSection';

const meta = {
  title: 'Pages/DeploymentSection',
  component: DeploymentSection,
  args: {
    markdown: mockContent.docs.deployment,
    sourceLabel: mockContent.sources.deployment
  }
} satisfies Meta<typeof DeploymentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

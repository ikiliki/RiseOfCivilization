import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesByStatus } from './FeaturesByStatus';
import type { FeatureSummary, WorkItem } from '../../types/content';

const meta: Meta<typeof FeaturesByStatus> = {
  title: 'Docs/FeaturesByStatus',
  component: FeaturesByStatus,
};

export default meta;
type Story = StoryObj<typeof FeaturesByStatus>;

const features: FeatureSummary[] = [
  { id: '1.3', title: 'Feature 1.3: Documentation hub', status: 'in_progress', summary: '' },
  { id: '1.2', title: 'Feature 1.2: Redis infra', status: 'done', summary: '' },
];

const workItems: WorkItem[] = [
  { id: '1', title: 'Operations board polish', status: 'new', feature: '1.3', subTasks: ['Simplify docs portal'] },
  { id: '2', title: 'Operations hardening', status: 'in_progress', feature: '1.3', subTasks: ['Add integration tests'] },
  { id: '3', title: 'Monorepo scaffold', status: 'done', feature: '1.3', subTasks: [] },
  { id: '4', title: 'Redis stateless gateway', status: 'done', feature: '1.2', subTasks: [] },
];

export const Default: Story = {
  args: {
    items: workItems,
    selectedFeatureId: 'all',
    features,
  },
};

export const FilteredByFeature: Story = {
  args: {
    items: workItems,
    selectedFeatureId: '1.3',
    features,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    selectedFeatureId: 'all',
    features,
  },
};

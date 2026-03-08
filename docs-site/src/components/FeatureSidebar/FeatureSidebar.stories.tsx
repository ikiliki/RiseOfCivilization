import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FeatureSidebar } from './FeatureSidebar';
import type { FeatureSummary } from '../../types/content';

const meta: Meta<typeof FeatureSidebar> = {
  title: 'Docs/FeatureSidebar',
  component: FeatureSidebar,
};

export default meta;
type Story = StoryObj<typeof FeatureSidebar>;

const features: FeatureSummary[] = [
  { id: '1', title: 'Feature 1: MVP', status: 'done', summary: 'First playable.' },
  { id: '1.1', title: 'Feature 1.1: Multiplayer infra', status: 'done', summary: 'WebSocket real-time layer.' },
  { id: '1.2', title: 'Feature 1.2: Redis infra', status: 'done', summary: 'Stateless gateway with Redis.' },
  { id: '1.3', title: 'Feature 1.3: Documentation hub', status: 'in_progress', summary: 'Internal docs platform with features visibility.' },
];

function FeatureSidebarWithState() {
  const [selected, setSelected] = useState<string | 'all'>('all');
  return (
    <FeatureSidebar
      features={features}
      selectedFeatureId={selected}
      onFeatureSelect={setSelected}
      currentFeatureLabel="Feature 1.3: Documentation hub"
    />
  );
}

export const Default: Story = {
  render: () => <FeatureSidebarWithState />,
};

export const EmptyFeatures: Story = {
  args: {
    features: [],
    selectedFeatureId: 'all',
    onFeatureSelect: () => {},
    currentFeatureLabel: 'Feature 1.3',
  },
};

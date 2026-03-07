import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StatusFilters } from './StatusFilters';

const meta = {
  title: 'Components/StatusFilters',
  component: StatusFilters
} satisfies Meta<typeof StatusFilters>;

export default meta;

type Story = StoryObj<typeof meta>;

function StatefulFilters() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'done'>('all');
  const [phaseFilter, setPhaseFilter] = useState('all');

  return (
    <StatusFilters
      phaseFilter={phaseFilter}
      phaseOptions={['MVP', 'Phase 2', 'Phase 2.5', 'Phase 3']}
      statusFilter={statusFilter}
      totalCount={14}
      visibleCount={8}
      onPhaseChange={setPhaseFilter}
      onStatusChange={setStatusFilter}
    />
  );
}

export const Default: Story = {
  args: {
    phaseFilter: 'all',
    phaseOptions: ['MVP', 'Phase 2', 'Phase 2.5', 'Phase 3'],
    statusFilter: 'all',
    totalCount: 14,
    visibleCount: 8,
    onPhaseChange: () => undefined,
    onStatusChange: () => undefined
  },
  render: () => <StatefulFilters />
};

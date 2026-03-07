import type { Meta, StoryObj } from '@storybook/react';
import { WorkItemsBoard } from './WorkItemsBoard';

const meta = {
  title: 'Components/WorkItemsBoard',
  component: WorkItemsBoard
} satisfies Meta<typeof WorkItemsBoard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pbiTitle: 'Phase 3: Operations UI and Hardening',
    items: [
      {
        id: 'done-1',
        title: 'Phase 2.5 stateless realtime foundation implemented.',
        status: 'done',
        phase: 'Phase 2.5',
        subTasks: []
      },
      {
        id: 'current-1',
        title: 'Phase 3 execution kickoff (operations + quality hardening).',
        status: 'in_progress',
        phase: 'Phase 3',
        subTasks: [
          'Add integration tests for cross-instance fanout.',
          'Add API-level coverage for remove-user endpoints.'
        ]
      },
      {
        id: 'next-1',
        title: 'Operations board and observability polish.',
        status: 'new',
        phase: 'Phase 3',
        subTasks: ['Simplify docs portal status board.', 'Add Redis troubleshooting runbook.']
      }
    ]
  }
};

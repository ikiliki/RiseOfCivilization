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
    pbiTitle: 'Feature 1.3: Documentation hub',
    items: [
      {
        id: 'done-1',
        title: 'Feature 1.2 stateless realtime foundation implemented.',
        status: 'done',
        feature: '1.2',
        subTasks: []
      },
      {
        id: 'current-1',
        title: 'Operations hardening (operations + quality hardening).',
        status: 'in_progress',
        feature: '1.3',
        subTasks: [
          'Add integration tests for cross-instance fanout.',
          'Add API-level coverage for remove-user endpoints.'
        ]
      },
      {
        id: 'next-1',
        title: 'Operations board and observability polish.',
        status: 'new',
        feature: '1.3',
        subTasks: ['Simplify docs portal status board.', 'Add Redis troubleshooting runbook.']
      }
    ]
  }
};

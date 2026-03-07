import type { Meta, StoryObj } from '@storybook/react';
import { mockContent } from '../../lib/mockContent';
import { DiagramsSection } from './DiagramsSection';

const meta = {
  title: 'Pages/DiagramsSection',
  component: DiagramsSection,
  args: {
    diagrams: mockContent.diagrams,
    sourceLabel: mockContent.sources.diagramsDoc
  }
} satisfies Meta<typeof DiagramsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    diagrams: []
  }
};

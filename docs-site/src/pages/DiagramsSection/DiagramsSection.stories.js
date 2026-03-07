import { mockContent } from '../../lib/mockContent';
import { DiagramsSection } from './DiagramsSection';
const meta = {
    title: 'Pages/DiagramsSection',
    component: DiagramsSection,
    args: {
        diagrams: mockContent.diagrams,
        sourceLabel: mockContent.sources.diagramsDoc
    }
};
export default meta;
export const Default = {};
export const Empty = {
    args: {
        diagrams: []
    }
};

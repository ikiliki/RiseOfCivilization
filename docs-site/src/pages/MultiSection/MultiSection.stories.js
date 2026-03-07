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
        sourceLabel: 'PLAN.md + docs/architecture/technical-architecture.md + docs/product/implementation-roadmap.md + docs/changelog-session-summary.md'
    }
};
export default meta;
export const Default = {};
export const Empty = {
    args: {
        multiSubSteps: [],
        architectureMarkdown: '# Architecture\n\n## Phase 2 Multiplayer (Implemented)\n',
        roadmapMarkdown: '# Roadmap\n'
    }
};

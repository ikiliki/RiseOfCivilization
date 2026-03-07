import { mockContent } from '../../lib/mockContent';
import { HomeSection } from './HomeSection';
const meta = {
    title: 'Pages/HomeSection',
    component: HomeSection,
    args: {
        phase: mockContent.planStatus.phase,
        planStatus: mockContent.planStatus,
        projectSummary: 'Rise Of Civilization is in active implementation with a shared world and multiplayer foundation work.',
        roadmapMarkdown: mockContent.docs.roadmap,
        sourceLabel: mockContent.sources.docsReadme
    }
};
export default meta;
export const Default = {};

import { mockContent } from '../../lib/mockContent';
import { StepsSection } from './StepsSection';
const meta = {
    title: 'Pages/StepsSection',
    component: StepsSection,
    args: {
        planStatus: mockContent.planStatus,
        roadmapMarkdown: mockContent.docs.roadmap,
        sourceLabel: 'PLAN.md + docs/product/implementation-roadmap.md'
    }
};
export default meta;
export const Default = {};

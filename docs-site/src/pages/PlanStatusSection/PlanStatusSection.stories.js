import { mockContent } from '../../lib/mockContent';
import { PlanStatusSection } from './PlanStatusSection';
const meta = {
    title: 'Pages/PlanStatusSection',
    component: PlanStatusSection,
    args: {
        planStatus: mockContent.planStatus,
        roadmapMarkdown: mockContent.docs.roadmap,
        sourceLabel: mockContent.sources.plan
    }
};
export default meta;
export const Default = {};
export const LongContent = {
    args: {
        planStatus: {
            ...mockContent.planStatus,
            current: [
                ...mockContent.planStatus.current,
                {
                    title: 'Validate Redis fanout under movement load.',
                    subTasks: ['Simulate multi-instance movement bursts.', 'Verify no stale users remain.']
                }
            ],
            next: [
                ...mockContent.planStatus.next,
                {
                    title: 'Document follow-up work for portal iteration.',
                    subTasks: ['Record decisions', 'Validate release notes']
                }
            ]
        }
    }
};

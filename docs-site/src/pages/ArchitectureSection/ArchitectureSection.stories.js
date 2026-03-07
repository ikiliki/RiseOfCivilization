import { mockContent } from '../../lib/mockContent';
import { ArchitectureSection } from './ArchitectureSection';
const meta = {
    title: 'Pages/ArchitectureSection',
    component: ArchitectureSection,
    args: {
        markdown: mockContent.docs.architecture,
        sourceLabel: mockContent.sources.architecture
    }
};
export default meta;
export const Default = {};

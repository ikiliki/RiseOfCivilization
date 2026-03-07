import { mockContent } from '../../lib/mockContent';
import { DesignSection } from './DesignSection';
const meta = {
    title: 'Pages/DesignSection',
    component: DesignSection,
    args: {
        markdown: mockContent.docs.design,
        sourceLabel: mockContent.sources.design
    }
};
export default meta;
export const Default = {};

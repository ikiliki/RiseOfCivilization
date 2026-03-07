import { mockContent } from '../../lib/mockContent';
import { LocalDevSection } from './LocalDevSection';
const meta = {
    title: 'Pages/LocalDevSection',
    component: LocalDevSection,
    args: {
        markdown: mockContent.docs.localDev,
        sourceLabel: mockContent.sources.localDev
    }
};
export default meta;
export const Default = {};

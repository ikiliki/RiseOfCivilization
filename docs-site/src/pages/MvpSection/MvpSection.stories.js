import { mockContent } from '../../lib/mockContent';
import { MvpSection } from './MvpSection';
const meta = {
    title: 'Pages/MvpSection',
    component: MvpSection,
    args: {
        markdown: mockContent.docs.mvp,
        sourceLabel: mockContent.sources.mvp
    }
};
export default meta;
export const Default = {};
export const Empty = {
    args: {
        markdown: ''
    }
};

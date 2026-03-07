import { mockContent } from '../../lib/mockContent';
import { StorybookSection } from './StorybookSection';
const meta = {
    title: 'Pages/StorybookSection',
    component: StorybookSection,
    args: {
        iframeUrl: 'about:blank',
        markdown: mockContent.docs.storybook,
        sourceLabel: mockContent.sources.storybook
    }
};
export default meta;
export const Default = {};

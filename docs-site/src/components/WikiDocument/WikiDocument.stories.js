import { WikiDocument } from './WikiDocument';
import { mockContent } from '../../lib/mockContent';
const meta = {
    title: 'Components/WikiDocument',
    component: WikiDocument
};
export default meta;
export const Default = {
    args: {
        id: 'design',
        title: 'Design',
        sourceLabel: 'docs/design/game-design-brief.md',
        markdown: mockContent.docs.design
    }
};

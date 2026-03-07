import { mockContent } from '../../lib/mockContent';
import { DeploymentSection } from './DeploymentSection';
const meta = {
    title: 'Pages/DeploymentSection',
    component: DeploymentSection,
    args: {
        markdown: mockContent.docs.deployment,
        sourceLabel: mockContent.sources.deployment
    }
};
export default meta;
export const Default = {};

import { EmbeddedMermaid } from './EmbeddedMermaid';
const meta = {
    title: 'Components/EmbeddedMermaid',
    component: EmbeddedMermaid
};
export default meta;
export const Default = {
    args: {
        code: 'flowchart LR\n  Client --> Server\n  Server --> Redis\n  Server --> PostgreSQL'
    }
};

import { WorkItemCard } from './WorkItemCard';
const meta = {
    title: 'Docs/WorkItemCard',
    component: WorkItemCard,
};
export default meta;
const itemNew = {
    id: 'next-operations-board',
    title: 'Operations board and observability polish',
    status: 'new',
    feature: '1.3',
    subTasks: [
        'Simplify docs portal status board for feature/task execution visibility.',
        'Add runbook snippets for Redis presence troubleshooting and forced logout flow.',
    ],
};
const itemInProgress = {
    id: 'current-operations-kickoff',
    title: 'Phase 3 execution kickoff (operations + quality hardening).',
    status: 'in_progress',
    feature: '1.3',
    subTasks: [
        '[ ] Add integration tests for cross-instance fanout and stale-presence cleanup.',
        '[ ] Add API-level coverage for admin remove-user and live presence endpoints.',
    ],
};
const itemDone = {
    id: 'done-monorepo-scaffold',
    title: 'Monorepo scaffold created with apps/client, apps/server, packages/shared-types, packages/world-engine, packages/ui, and docker.',
    status: 'done',
    feature: '1.3',
    subTasks: [],
};
const itemManySubTasks = {
    id: 'next-many-tasks',
    title: 'Product quality passes',
    status: 'new',
    feature: '1.3',
    subTasks: [
        'Tune multiplayer camera/nametag behavior',
        'Continue debug overlay ergonomics',
        'Add integration tests for fanout',
        'Add contract tests for presence endpoints',
        'Polish runbook snippets',
        'Improve panel usability',
    ],
};
export const Ahead = {
    args: { item: itemNew },
};
export const InProgress = {
    args: { item: itemInProgress },
};
export const Done = {
    args: { item: itemDone },
};
export const ManySubTasks = {
    args: { item: itemManySubTasks },
};

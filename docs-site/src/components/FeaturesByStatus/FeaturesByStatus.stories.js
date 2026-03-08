import { FeaturesByStatus } from './FeaturesByStatus';
const meta = {
    title: 'Docs/FeaturesByStatus',
    component: FeaturesByStatus,
};
export default meta;
const features = [
    { id: '1.3', title: 'Feature 1.3: Documentation hub', status: 'in_progress', summary: '' },
    { id: '1.2', title: 'Feature 1.2: Redis infra', status: 'done', summary: '' },
];
const workItems = [
    { id: '1', title: 'Operations board polish', status: 'new', feature: '1.3', subTasks: ['Simplify docs portal'] },
    { id: '2', title: 'Operations hardening', status: 'in_progress', feature: '1.3', subTasks: ['Add integration tests'] },
    { id: '3', title: 'Monorepo scaffold', status: 'done', feature: '1.3', subTasks: [] },
    { id: '4', title: 'Redis stateless gateway', status: 'done', feature: '1.2', subTasks: [] },
];
export const Default = {
    args: {
        items: workItems,
        selectedFeatureId: 'all',
        features,
    },
};
export const FilteredByFeature = {
    args: {
        items: workItems,
        selectedFeatureId: '1.3',
        features,
    },
};
export const Empty = {
    args: {
        items: [],
        selectedFeatureId: 'all',
        features,
    },
};

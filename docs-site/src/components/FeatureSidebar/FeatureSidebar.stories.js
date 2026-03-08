import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { FeatureSidebar } from './FeatureSidebar';
const meta = {
    title: 'Docs/FeatureSidebar',
    component: FeatureSidebar,
};
export default meta;
const features = [
    { id: '1', title: 'Feature 1: MVP', status: 'done', summary: 'First playable.' },
    { id: '1.1', title: 'Feature 1.1: Multiplayer infra', status: 'done', summary: 'WebSocket real-time layer.' },
    { id: '1.2', title: 'Feature 1.2: Redis infra', status: 'done', summary: 'Stateless gateway with Redis.' },
    { id: '1.3', title: 'Feature 1.3: Documentation hub', status: 'in_progress', summary: 'Internal docs platform with features visibility.' },
];
function FeatureSidebarWithState() {
    const [selected, setSelected] = useState('all');
    return (_jsx(FeatureSidebar, { features: features, selectedFeatureId: selected, onFeatureSelect: setSelected, currentFeatureLabel: "Feature 1.3: Documentation hub" }));
}
export const Default = {
    render: () => _jsx(FeatureSidebarWithState, {}),
};
export const EmptyFeatures = {
    args: {
        features: [],
        selectedFeatureId: 'all',
        onFeatureSelect: () => { },
        currentFeatureLabel: 'Feature 1.3',
    },
};

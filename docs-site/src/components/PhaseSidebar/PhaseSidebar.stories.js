import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { PhaseSidebar } from './PhaseSidebar';
const meta = {
    title: 'Docs/PhaseSidebar',
    component: PhaseSidebar,
};
export default meta;
const features = [
    { id: '1.3', title: 'Feature 1.3: Documentation hub', status: 'in_progress', summary: 'Internal docs platform with features visibility.' },
    { id: '1.2', title: 'Feature 1.2: Redis infra', status: 'done', summary: 'Stateless gateway with Redis.' },
    { id: '1.1', title: 'Feature 1.1: Multiplayer infra', status: 'done', summary: 'WebSocket real-time layer.' },
    { id: '1', title: 'Feature 1: MVP', status: 'done', summary: 'First playable.' },
];
function PhaseSidebarWithState() {
    const [selected, setSelected] = useState('all');
    return (_jsx(PhaseSidebar, { features: features, selectedFeatureId: selected, onFeatureSelect: setSelected, currentFeatureLabel: "Feature 1.3: Documentation hub" }));
}
export const Default = {
    render: () => _jsx(PhaseSidebarWithState, {}),
};
export const EmptyFeatures = {
    args: {
        features: [],
        selectedFeatureId: 'all',
        onFeatureSelect: () => { },
        currentFeatureLabel: 'Feature 1.3',
    },
};

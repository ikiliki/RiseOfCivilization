import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { StatusFilters } from './StatusFilters';
const meta = {
    title: 'Components/StatusFilters',
    component: StatusFilters
};
export default meta;
function StatefulFilters() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [phaseFilter, setPhaseFilter] = useState('all');
    return (_jsx(StatusFilters, { phaseFilter: phaseFilter, phaseOptions: ['MVP', 'Phase 2', 'Phase 2.5', 'Phase 3'], statusFilter: statusFilter, totalCount: 14, visibleCount: 8, onPhaseChange: setPhaseFilter, onStatusChange: setStatusFilter }));
}
export const Default = {
    args: {
        phaseFilter: 'all',
        phaseOptions: ['MVP', 'Phase 2', 'Phase 2.5', 'Phase 3'],
        statusFilter: 'all',
        totalCount: 14,
        visibleCount: 8,
        onPhaseChange: () => undefined,
        onStatusChange: () => undefined
    },
    render: () => _jsx(StatefulFilters, {})
};

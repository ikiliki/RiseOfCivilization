import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { PhaseDashboard } from '../../components/PhaseDashboard/PhaseDashboard';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import { StatusFilters } from '../../components/StatusFilters/StatusFilters';
import { WorkItemsBoard } from '../../components/WorkItemsBoard/WorkItemsBoard';
import { extractRoadmapFeatures, filterWorkItems, getFeatureOptions, normalizeWorkItems } from '../../lib/dashboard';
import styles from './PlanStatusSection.styles.module.css';
export function PlanStatusSection({ planStatus, roadmapMarkdown, sourceLabel }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [phaseFilter, setPhaseFilter] = useState('all');
    const workItems = useMemo(() => normalizeWorkItems(planStatus), [planStatus]);
    const currentFeature = planStatus.feature ?? planStatus.phase ?? '';
    const featureCards = useMemo(() => extractRoadmapFeatures(roadmapMarkdown, currentFeature), [roadmapMarkdown, currentFeature]);
    const featureOptions = useMemo(() => getFeatureOptions(workItems, featureCards), [workItems, featureCards]);
    const filteredItems = useMemo(() => filterWorkItems(workItems, statusFilter, phaseFilter), [workItems, statusFilter, phaseFilter]);
    return (_jsxs(SectionShell, { id: "plan-status", title: "Plan Status", sourceLabel: sourceLabel, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles.phaseCard, children: [_jsx("span", { className: styles.eyebrow, children: "Current PBI" }), _jsx("h3", { children: currentFeature }), _jsx("p", { className: styles.phaseHint, children: "The active phase is the top-level PBI. The board below breaks the work into done, current, and next execution items." })] }), _jsxs("div", { className: styles.statCards, children: [_jsxs("div", { className: styles.statCard, children: [_jsx("span", { className: styles.statValue, children: planStatus.completed.length }), _jsx("span", { className: styles.statLabel, children: "Done" })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("span", { className: styles.statValue, children: planStatus.current.length }), _jsx("span", { className: styles.statLabel, children: "Current" })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("span", { className: styles.statValue, children: planStatus.next.length }), _jsx("span", { className: styles.statLabel, children: "Next" })] })] })] }), _jsxs("div", { className: styles.phaseDashboard, children: [_jsxs("div", { className: styles.blockHeader, children: [_jsx("h3", { children: "Feature Status" }), _jsx("p", { children: "Features derived from the synced implementation roadmap." })] }), _jsx(PhaseDashboard, { phases: featureCards })] }), _jsxs("div", { className: styles.board, children: [_jsxs("div", { className: styles.blockHeader, children: [_jsx("h3", { children: "Task Board" }), _jsx("p", { children: "Filter work items by feature or status to narrow the current execution set." })] }), _jsx(StatusFilters, { phaseFilter: phaseFilter, phaseOptions: featureOptions, statusFilter: statusFilter, totalCount: workItems.length, visibleCount: filteredItems.length, onPhaseChange: setPhaseFilter, onStatusChange: setStatusFilter }), _jsx(WorkItemsBoard, { items: filteredItems, pbiTitle: currentFeature })] })] }));
}

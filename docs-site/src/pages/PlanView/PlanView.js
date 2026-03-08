import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { WorkItemsBoard } from '../../components/WorkItemsBoard/WorkItemsBoard';
import { StatusFilters } from '../../components/StatusFilters/StatusFilters';
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import { normalizeWorkItems, extractRoadmapFeatures, getFeatureOptions, filterWorkItems } from '../../lib/dashboard';
import styles from './PlanView.styles.module.css';
export function PlanView({ content }) {
    const [subTab, setSubTab] = useState('tasks');
    const [statusFilter, setStatusFilter] = useState('all');
    const [featureFilter, setFeatureFilter] = useState('all');
    const workItems = useMemo(() => {
        if (content.plan?.workItems?.length) {
            return content.plan.workItems;
        }
        if (content.planStatus) {
            return normalizeWorkItems(content.planStatus);
        }
        return [];
    }, [content.plan?.workItems, content.planStatus]);
    const currentFeatureLabel = content.planStatus?.feature ??
        content.planStatus?.phase ??
        content.overview?.currentFeature ??
        content.overview?.currentPhase ??
        'Unknown';
    const features = useMemo(() => {
        if (content.plan?.features?.length) {
            return content.plan.features;
        }
        if (content.docs?.roadmap && currentFeatureLabel) {
            return extractRoadmapFeatures(content.docs.roadmap, currentFeatureLabel);
        }
        return [];
    }, [content.plan?.features, content.docs?.roadmap, currentFeatureLabel]);
    const featureOptions = useMemo(() => getFeatureOptions(workItems, features.map((f) => ({ title: f.title }))), [workItems, features]);
    const filteredItems = useMemo(() => filterWorkItems(workItems, statusFilter, featureFilter), [workItems, statusFilter, featureFilter]);
    const subTabs = [
        { id: 'tasks', label: 'Tasks' },
        { id: 'board', label: 'Board' },
        { id: 'more', label: 'More' }
    ];
    return (_jsxs("section", { className: styles.plan, "aria-labelledby": "plan-heading", children: [_jsx("h2", { id: "plan-heading", children: "Plan" }), _jsx("div", { className: styles.subTabs, children: subTabs.map((tab) => (_jsx("button", { type: "button", className: `${styles.subTab} ${subTab === tab.id ? styles.active : ''}`, onClick: () => setSubTab(tab.id), children: tab.label }, tab.id))) }), subTab === 'tasks' && (_jsxs("div", { className: styles.tasksView, children: [_jsx(StatusFilters, { phaseFilter: featureFilter, phaseOptions: featureOptions, statusFilter: statusFilter, totalCount: workItems.length, visibleCount: filteredItems.length, onPhaseChange: setFeatureFilter, onStatusChange: (v) => setStatusFilter(v === 'all' ? 'all' : v) }), _jsx("div", { className: styles.taskList, children: filteredItems.length ? (filteredItems.map((item) => (_jsxs("article", { className: styles.taskCard, children: [_jsxs("div", { className: styles.taskHeader, children: [_jsx("strong", { children: item.title }), _jsx("span", { className: `${styles.badge} ${styles[item.status]}`, children: item.status.replace('_', ' ') })] }), _jsx("span", { className: styles.phaseBadge, children: item.feature ?? item.phase }), item.subTasks.length ? (_jsx("ul", { className: styles.subTasks, children: item.subTasks.map((st) => (_jsx("li", { children: st }, st))) })) : null] }, item.id)))) : (_jsx("p", { children: "No work items match the current filters." })) })] })), subTab === 'board' && (_jsx(WorkItemsBoard, { items: workItems, pbiTitle: currentFeatureLabel })), subTab === 'more' && (_jsxs("div", { className: styles.moreView, children: [_jsx("h3", { children: "Roadmap Features" }), features.length ? (_jsx("ul", { className: "list", children: features.map((f) => (_jsxs("li", { children: [_jsx("strong", { children: f.title }), f.summary ? ` — ${f.summary}` : ''] }, f.id))) })) : (_jsx("p", { children: "No roadmap features available." })), content.docs?.roadmap && (_jsxs(_Fragment, { children: [_jsx("h3", { children: "Full Roadmap" }), _jsx(MarkdownContent, { markdown: content.docs.roadmap })] }))] }))] }));
}

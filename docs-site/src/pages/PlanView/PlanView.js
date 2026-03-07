import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { WorkItemsBoard } from '../../components/WorkItemsBoard/WorkItemsBoard';
import { StatusFilters } from '../../components/StatusFilters/StatusFilters';
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import { normalizeWorkItems, extractRoadmapPhases, getPhaseOptions, filterWorkItems } from '../../lib/dashboard';
import styles from './PlanView.styles.module.css';
export function PlanView({ content }) {
    const [subTab, setSubTab] = useState('tasks');
    const [statusFilter, setStatusFilter] = useState('all');
    const [phaseFilter, setPhaseFilter] = useState('all');
    const workItems = useMemo(() => {
        if (content.plan?.workItems?.length) {
            return content.plan.workItems;
        }
        if (content.planStatus) {
            return normalizeWorkItems(content.planStatus);
        }
        return [];
    }, [content.plan?.workItems, content.planStatus]);
    const phases = useMemo(() => {
        if (content.plan?.phases?.length) {
            return content.plan.phases;
        }
        if (content.docs?.roadmap && content.planStatus?.phase) {
            return extractRoadmapPhases(content.docs.roadmap, content.planStatus.phase);
        }
        return [];
    }, [content.plan?.phases, content.docs?.roadmap, content.planStatus?.phase]);
    const phaseOptions = useMemo(() => getPhaseOptions(workItems, phases.map((p) => ({ title: p.title }))), [workItems, phases]);
    const filteredItems = useMemo(() => filterWorkItems(workItems, statusFilter, phaseFilter), [workItems, statusFilter, phaseFilter]);
    const currentPhase = content.overview?.currentPhase ?? content.planStatus?.phase ?? 'Unknown';
    const subTabs = [
        { id: 'tasks', label: 'Tasks' },
        { id: 'board', label: 'Board' },
        { id: 'more', label: 'More' }
    ];
    return (_jsxs("section", { className: styles.plan, "aria-labelledby": "plan-heading", children: [_jsx("h2", { id: "plan-heading", children: "Plan" }), _jsx("div", { className: styles.subTabs, children: subTabs.map((tab) => (_jsx("button", { type: "button", className: `${styles.subTab} ${subTab === tab.id ? styles.active : ''}`, onClick: () => setSubTab(tab.id), children: tab.label }, tab.id))) }), subTab === 'tasks' && (_jsxs("div", { className: styles.tasksView, children: [_jsx(StatusFilters, { phaseFilter: phaseFilter, phaseOptions: phaseOptions, statusFilter: statusFilter, totalCount: workItems.length, visibleCount: filteredItems.length, onPhaseChange: setPhaseFilter, onStatusChange: (v) => setStatusFilter(v === 'all' ? 'all' : v) }), _jsx("div", { className: styles.taskList, children: filteredItems.length ? (filteredItems.map((item) => (_jsxs("article", { className: styles.taskCard, children: [_jsxs("div", { className: styles.taskHeader, children: [_jsx("strong", { children: item.title }), _jsx("span", { className: `${styles.badge} ${styles[item.status]}`, children: item.status.replace('_', ' ') })] }), _jsx("span", { className: styles.phaseBadge, children: item.phase }), item.subTasks.length ? (_jsx("ul", { className: styles.subTasks, children: item.subTasks.map((st) => (_jsx("li", { children: st }, st))) })) : null] }, item.id)))) : (_jsx("p", { children: "No work items match the current filters." })) })] })), subTab === 'board' && (_jsx(WorkItemsBoard, { items: workItems, pbiTitle: currentPhase })), subTab === 'more' && (_jsxs("div", { className: styles.moreView, children: [_jsx("h3", { children: "Roadmap Milestones" }), phases.length ? (_jsx("ul", { className: "list", children: phases.map((p) => (_jsxs("li", { children: [_jsx("strong", { children: p.title }), p.summary ? ` — ${p.summary}` : ''] }, p.id))) })) : (_jsx("p", { children: "No roadmap phases available." })), content.docs?.roadmap && (_jsxs(_Fragment, { children: [_jsx("h3", { children: "Full Roadmap" }), _jsx(MarkdownContent, { markdown: content.docs.roadmap })] }))] }))] }));
}

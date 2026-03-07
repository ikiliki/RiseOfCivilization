import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { PhaseDashboard } from '../../components/PhaseDashboard/PhaseDashboard';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import { StatusFilters } from '../../components/StatusFilters/StatusFilters';
import { WorkItemsBoard } from '../../components/WorkItemsBoard/WorkItemsBoard';
import { extractRoadmapPhases, filterWorkItems, getPhaseOptions, normalizeWorkItems } from '../../lib/dashboard';
import styles from './HomeSection.styles.module.css';
const quickLinks = [
    ['MVP', '#mvp'],
    ['MULTI', '#multi'],
    ['Design', '#design'],
    ['Architecture', '#architecture'],
    ['Local Dev', '#local-dev'],
    ['Deployment', '#deployment'],
    ['Storybook', '#storybook'],
    ['Plan Status', '#plan-status']
];
export function HomeSection({ phase, planStatus, projectSummary, roadmapMarkdown, sourceLabel }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [phaseFilter, setPhaseFilter] = useState('all');
    const workItems = useMemo(() => normalizeWorkItems(planStatus), [planStatus]);
    const phaseCards = useMemo(() => extractRoadmapPhases(roadmapMarkdown, phase), [roadmapMarkdown, phase]);
    const filteredItems = useMemo(() => filterWorkItems(workItems, statusFilter, phaseFilter), [workItems, statusFilter, phaseFilter]);
    const phaseOptions = useMemo(() => getPhaseOptions(workItems, phaseCards), [workItems, phaseCards]);
    const kpis = [
        { label: 'Completed', value: planStatus.completed.length },
        { label: 'Current Tasks', value: planStatus.current.length },
        { label: 'Next Tasks', value: planStatus.next.length },
        { label: 'Roadmap Phases', value: phaseCards.length }
    ];
    const cards = [
        { title: 'Project', text: 'Rise Of Civilization' },
        { title: 'Current PBI', text: phase, isPhase: true },
        {
            title: 'Portal Mode',
            text: 'Azure-style execution dashboard backed by synced markdown docs.'
        },
        {
            title: 'Source Of Truth',
            text: 'All cards, wiki pages, and diagrams read from docs-site/sync-docs.mjs output.'
        }
    ];
    return (_jsxs(SectionShell, { id: "home", title: "Home", sourceLabel: sourceLabel, children: [_jsxs("div", { className: styles.hero, children: [_jsxs("div", { children: [_jsx("span", { className: styles.eyebrow, children: "Portfolio Dashboard" }), _jsx("h3", { children: "Execution Overview" }), _jsx("p", { children: projectSummary })] }), _jsxs("div", { className: styles.heroPhase, children: [_jsx("span", { className: styles.heroLabel, children: "Active Phase" }), _jsx("div", { className: "phase", children: phase })] })] }), _jsx("div", { className: `kpi-grid ${styles.kpis}`, children: kpis.map((kpi) => (_jsxs("div", { className: "kpi", children: [_jsx("span", { className: "value", children: kpi.value }), _jsx("span", { className: "label", children: kpi.label })] }, kpi.label))) }), _jsx("div", { className: `card-grid ${styles.summaryGrid}`, children: cards.map((card) => (_jsxs("article", { className: "card", children: [_jsx("h3", { children: card.title }), card.isPhase ? _jsx("div", { className: "phase", children: card.text }) : _jsx("p", { children: card.text })] }, card.title))) }), _jsxs("div", { className: styles.sectionBlock, children: [_jsxs("div", { className: styles.blockHeader, children: [_jsx("h3", { children: "Phase Dashboard" }), _jsx("p", { children: "Roadmap milestones rendered as Azure-style phase cards." })] }), _jsx(PhaseDashboard, { phases: phaseCards })] }), _jsxs("div", { className: styles.sectionBlock, children: [_jsxs("div", { className: styles.blockHeader, children: [_jsx("h3", { children: "PBI and Tasks" }), _jsx("p", { children: "Filter execution work by status and phase while keeping the current PBI visible." })] }), _jsx(StatusFilters, { phaseFilter: phaseFilter, phaseOptions: phaseOptions, statusFilter: statusFilter, totalCount: workItems.length, visibleCount: filteredItems.length, onPhaseChange: setPhaseFilter, onStatusChange: setStatusFilter }), _jsx(WorkItemsBoard, { items: filteredItems, pbiTitle: phase })] }), _jsx("div", { className: `card-grid ${styles.quickLinks}`, children: quickLinks.map(([label, href]) => (_jsxs("a", { className: "card", href: href, children: [_jsx("h3", { children: label }), _jsx("p", { children: "Open section" })] }, label))) })] }));
}

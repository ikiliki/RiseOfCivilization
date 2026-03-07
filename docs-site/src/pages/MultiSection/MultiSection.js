import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { extractListByHeading, extractRoadmapMilestone } from '../../lib/markdown';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import styles from './MultiSection.styles.module.css';
function renderList(items) {
    if (!items.length) {
        return _jsx("p", { children: "None." });
    }
    return (_jsx("ul", { className: "list", children: items.map((item) => (_jsx("li", { children: item }, item))) }));
}
export function MultiSection({ architectureMarkdown, multiSubSteps, planStatus, roadmapMarkdown, sourceLabel }) {
    const phase2Roadmap = extractRoadmapMilestone(roadmapMarkdown, 'Milestone 7: Phase 2 Multiplayer Foundation (Complete)');
    const architecturePhase2 = extractListByHeading(architectureMarkdown, 'Phase 2 Multiplayer (Implemented)');
    const phase2FromPlan = planStatus.completed.filter((item) => item.toLowerCase().includes('phase 2'));
    return (_jsxs(SectionShell, { id: "multi", title: "Step 2: MULTI", sourceLabel: sourceLabel, children: [_jsxs("div", { className: "hero", children: [_jsx("h3", { children: "Current Multiplayer Step" }), _jsx("p", { children: "Phase 2 focuses on shared-world player presence and inspection, without moving to full server-authoritative gameplay yet." })] }), _jsxs("article", { className: "status-card done", children: [_jsx("h3", { children: "Recent Session Sub-Steps" }), _jsx("div", { className: `task-list ${styles.taskList}`, children: multiSubSteps.length ? (multiSubSteps.map((item) => (_jsxs("article", { className: "task-card", children: [_jsx("div", { className: "task-header", children: _jsx("strong", { className: "task-title", children: item.title }) }), item.subItems && item.subItems.length ? (_jsxs("details", { className: "task-sub", open: true, children: [_jsxs("summary", { children: [item.subItems.length, " sub-item", item.subItems.length === 1 ? '' : 's'] }), _jsx("ul", { className: "sub-task-list", children: item.subItems.map((subItem) => (_jsx("li", { children: subItem }, subItem))) })] })) : null] }, item.title)))) : (_jsx("p", { children: "No sub-steps found." })) })] }), _jsxs("div", { className: "status-grid", children: [_jsxs("article", { className: "status-card done", children: [_jsx("h3", { children: "Roadmap Milestone 7" }), renderList(phase2Roadmap)] }), _jsxs("article", { className: "status-card next", children: [_jsx("h3", { children: "Architecture Implementation Notes" }), renderList(architecturePhase2)] })] }), _jsxs("article", { className: "status-card", children: [_jsx("h3", { children: "Plan Entries" }), renderList(phase2FromPlan)] })] }));
}

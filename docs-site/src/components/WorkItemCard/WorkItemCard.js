import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './WorkItemCard.styles.module.css';
const VISIBLE_SUB_TASKS = 4;
export function WorkItemCard({ item }) {
    const [expanded, setExpanded] = useState(false);
    const hasSubTasks = item.subTasks.length > 0;
    const visibleSubTasks = expanded ? item.subTasks : item.subTasks.slice(0, VISIBLE_SUB_TASKS);
    const hiddenCount = Math.max(0, item.subTasks.length - VISIBLE_SUB_TASKS);
    return (_jsxs("article", { className: styles.card, children: [_jsxs("div", { className: styles.cardHeader, children: [_jsx("strong", { className: styles.title, children: item.title }), _jsx("span", { className: `${styles.statusBadge} ${styles[item.status]}`, children: item.status === 'new' ? 'Ahead' : item.status === 'in_progress' ? 'In Progress' : 'Done' })] }), _jsx("div", { className: styles.meta, children: _jsx("span", { className: styles.featureBadge, children: item.feature ?? item.phase }) }), hasSubTasks && (_jsxs("div", { className: styles.subTasksSection, children: [_jsx("ul", { className: styles.subTasks, children: visibleSubTasks.map((subTask) => (_jsx("li", { children: subTask }, subTask))) }), !expanded && hiddenCount > 0 && (_jsxs("button", { type: "button", className: styles.expandBtn, onClick: () => setExpanded(true), "aria-expanded": false, children: ["\u2026and ", hiddenCount, " more"] })), expanded && hiddenCount > 0 && (_jsx("button", { type: "button", className: styles.expandBtn, onClick: () => setExpanded(false), "aria-expanded": true, children: "Collapse" }))] }))] }));
}

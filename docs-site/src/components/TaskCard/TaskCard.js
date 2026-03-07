import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './TaskCard.styles.module.css';
function formatTaskForAgent(task) {
    const subLines = task.subTasks && task.subTasks.length > 0
        ? `\n${task.subTasks.map((subTask) => `  - ${subTask}`).join('\n')}`
        : '';
    return `${task.title}${subLines}`;
}
export function TaskCard({ task }) {
    const [copyLabel, setCopyLabel] = useState('Copy for Agent');
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(formatTaskForAgent(task));
            setCopyLabel('Copied');
            window.setTimeout(() => setCopyLabel('Copy for Agent'), 1200);
        }
        catch {
            setCopyLabel('Copy failed');
            window.setTimeout(() => setCopyLabel('Copy for Agent'), 1200);
        }
    }
    return (_jsxs("article", { className: "task-card", children: [_jsxs("div", { className: "task-header", children: [_jsx("strong", { className: "task-title", children: task.title }), _jsx("button", { className: "copy-for-agent-btn", type: "button", onClick: handleCopy, children: copyLabel })] }), task.subTasks && task.subTasks.length > 0 ? (_jsxs("details", { className: `task-sub ${styles.taskSub}`, open: true, children: [_jsxs("summary", { children: [task.subTasks.length, " sub-task", task.subTasks.length === 1 ? '' : 's'] }), _jsx("ul", { className: "sub-task-list", children: task.subTasks.map((subTask) => (_jsx("li", { children: subTask }, subTask))) })] })) : null] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './WorkItemsBoard.styles.module.css';
const columns = [
    { label: 'New', status: 'new' },
    { label: 'In Progress', status: 'in_progress' },
    { label: 'Done', status: 'done' }
];
export function WorkItemsBoard({ items, pbiTitle }) {
    return (_jsxs("div", { className: styles.board, children: [_jsxs("article", { className: styles.pbiCard, children: [_jsx("span", { className: styles.eyebrow, children: "Current PBI" }), _jsx("h3", { children: pbiTitle }), _jsx("p", { children: "Feature execution is treated as the top-level work item. Tasks below are grouped by status." })] }), _jsx("div", { className: styles.columns, children: columns.map((column) => {
                    const columnItems = items.filter((item) => item.status === column.status);
                    return (_jsxs("section", { className: styles.column, children: [_jsxs("div", { className: styles.columnHeader, children: [_jsx("h3", { children: column.label }), _jsx("span", { className: styles.columnCount, children: columnItems.length })] }), _jsx("div", { className: styles.cardList, children: columnItems.length ? (columnItems.map((item) => (_jsxs("article", { className: styles.card, children: [_jsxs("div", { className: styles.cardHeader, children: [_jsx("strong", { children: item.title }), _jsx("span", { className: `${styles.statusBadge} ${styles[item.status]}`, children: item.status })] }), _jsxs("div", { className: styles.meta, children: [_jsx("span", { className: styles.phaseBadge, children: item.feature }), item.subTasks.length ? (_jsxs("span", { className: styles.subTaskCount, children: [item.subTasks.length, " tasks"] })) : null] }), item.subTasks.length ? (_jsx("ul", { className: styles.subTasks, children: item.subTasks.map((subTask) => (_jsx("li", { children: subTask }, subTask))) })) : (_jsx("p", { className: styles.noSubTasks, children: "No child tasks." }))] }, item.id)))) : (_jsx("div", { className: styles.emptyState, children: "No items match this column." })) })] }, column.status));
                }) })] }));
}

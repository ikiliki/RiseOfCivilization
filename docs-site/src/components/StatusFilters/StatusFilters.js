import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './StatusFilters.styles.module.css';
const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Done', value: 'done' }
];
export function StatusFilters({ phaseFilter, phaseOptions, statusFilter, totalCount, visibleCount, onPhaseChange, onStatusChange }) {
    return (_jsxs("div", { className: styles.filters, children: [_jsxs("div", { className: styles.summary, children: [_jsx("span", { className: styles.heading, children: "Work Item Filters" }), _jsxs("span", { className: styles.count, children: ["Showing ", visibleCount, " of ", totalCount] })] }), _jsxs("div", { className: styles.controls, children: [_jsx("div", { className: styles.statusButtons, role: "tablist", "aria-label": "Status filters", children: statusOptions.map((option) => (_jsx("button", { className: `${styles.filterButton} ${statusFilter === option.value ? styles.active : ''}`, type: "button", onClick: () => onStatusChange(option.value), children: option.label }, option.value))) }), _jsxs("label", { className: styles.phaseSelect, children: [_jsx("span", { children: "Phase" }), _jsxs("select", { value: phaseFilter, onChange: (event) => onPhaseChange(event.target.value), children: [_jsx("option", { value: "all", children: "All phases" }), phaseOptions.map((option) => (_jsx("option", { value: option, children: option }, option)))] })] })] })] }));
}

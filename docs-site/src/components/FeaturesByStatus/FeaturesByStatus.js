import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WorkItemCard } from '../WorkItemCard/WorkItemCard';
import styles from './FeaturesByStatus.styles.module.css';
const COLUMNS = [
    { key: 'new', label: 'Ahead', sublabel: '(Next)' },
    { key: 'in_progress', label: 'In Progress', sublabel: '(Current)' },
    { key: 'done', label: 'Done', sublabel: '(Completed)' },
];
function filterByFeature(items, selectedFeatureId, features) {
    if (selectedFeatureId === 'all')
        return items;
    const feature = features.find((f) => f.id === selectedFeatureId);
    if (!feature)
        return items;
    const getFeature = (item) => item.feature ?? item.phase ?? '';
    return items.filter((item) => getFeature(item) === feature.id);
}
export function FeaturesByStatus({ items, selectedFeatureId, features }) {
    const filtered = filterByFeature(items, selectedFeatureId, features);
    return (_jsxs("div", { className: styles.container, children: [_jsx("h2", { className: styles.mainHeading, children: "Features by Status" }), filtered.length === 0 ? (_jsx("div", { className: styles.emptyAll, children: _jsx("p", { children: selectedFeatureId === 'all'
                        ? 'No work items. Run `pnpm docs:sync` and ensure PLAN.md has Completed, In Progress, and Next sections.'
                        : 'No work items in this feature.' }) })) : (_jsx("div", { className: styles.columns, children: COLUMNS.map((col) => {
                    const columnItems = filtered.filter((item) => item.status === col.key);
                    return (_jsxs("section", { className: styles.column, "aria-labelledby": `col-${col.key}`, children: [_jsxs("div", { className: styles.columnHeader, children: [_jsx("h3", { id: `col-${col.key}`, className: styles.columnTitle, children: col.label }), _jsx("span", { className: styles.sublabel, children: col.sublabel }), _jsx("span", { className: styles.count, children: columnItems.length })] }), _jsx("div", { className: styles.cardList, children: columnItems.length > 0 ? (columnItems.map((item) => _jsx(WorkItemCard, { item: item }, item.id))) : (_jsx("div", { className: styles.emptyState, children: "No items" })) })] }, col.key));
                }) }))] }));
}

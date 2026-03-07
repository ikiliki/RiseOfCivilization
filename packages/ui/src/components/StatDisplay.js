import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './StatDisplay.styles.css';
export function StatDisplay({ label, value }) {
    return (_jsxs("div", { className: "roc-stat-display", children: [_jsx("span", { children: label }), _jsx("strong", { children: value })] }));
}

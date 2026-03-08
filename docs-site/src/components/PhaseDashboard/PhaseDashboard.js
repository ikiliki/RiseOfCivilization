import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './PhaseDashboard.styles.module.css';
export function PhaseDashboard({ phases }) {
    if (!phases.length) {
        return _jsx("p", { children: "No roadmap features available." });
    }
    return (_jsx("div", { className: styles.grid, children: phases.map((phase) => (_jsxs("article", { className: styles.card, children: [_jsxs("div", { className: styles.header, children: [_jsx("span", { className: styles.title, children: phase.title }), _jsx("span", { className: `${styles.badge} ${styles[phase.status]}`, children: phase.status })] }), _jsx("p", { className: styles.summary, children: phase.summary }), _jsx("ul", { className: styles.list, children: phase.bullets.slice(0, 3).map((bullet) => (_jsx("li", { children: bullet }, bullet))) })] }, phase.id))) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './HomeView.styles.module.css';
export function HomeView({ content }) {
    const overview = content.overview ?? {
        projectSummary: content.docs?.docsReadme
            ? (content.docs.docsReadme.match(/## Project Summary\s*([\s\S]*?)(?=##\s+|$)/m)?.[1]?.trim() ?? 'Internal docs portal.')
            : 'Internal docs portal for Rise Of Civilization.',
        currentFeature: content.planStatus?.feature ??
            content.planStatus?.phase ??
            'Unknown',
        lastUpdated: new Date().toISOString().slice(0, 10)
    };
    return (_jsxs("section", { className: styles.overview, "aria-labelledby": "overview-heading", children: [_jsx("h2", { id: "overview-heading", children: "Overview" }), _jsxs("div", { className: styles.cards, children: [_jsxs("article", { className: styles.card, children: [_jsx("h3", { children: "Project" }), _jsx("p", { children: "Rise Of Civilization" })] }), _jsxs("article", { className: styles.card, children: [_jsx("h3", { children: "Current Feature" }), _jsx("div", { className: styles.phase, children: overview.currentFeature ??
                                    overview.currentPhase })] }), _jsxs("article", { className: styles.card, children: [_jsx("h3", { children: "Last Updated" }), _jsx("p", { children: overview.lastUpdated })] })] }), _jsxs("div", { className: styles.summary, children: [_jsx("h3", { children: "Project Summary" }), _jsx("p", { children: overview.projectSummary })] }), _jsxs("div", { className: styles.meta, children: [_jsx("span", { className: "badge", children: "Internal" }), _jsx("span", { className: "badge", children: "Agents & Developers" }), _jsx("span", { className: "badge", children: "Synced from docs/ + PLAN.md" })] })] }));
}

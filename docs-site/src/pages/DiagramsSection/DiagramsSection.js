import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MermaidDiagram } from '../../components/MermaidDiagram/MermaidDiagram';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import styles from './DiagramsSection.styles.module.css';
export function DiagramsSection({ diagrams, sourceLabel }) {
    return (_jsx(SectionShell, { id: "diagrams", title: "Architecture Diagrams", sourceLabel: sourceLabel, children: _jsxs("div", { className: styles.diagrams, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { children: [_jsx("span", { className: styles.badge, children: "Graphs" }), _jsx("h3", { className: styles.title, children: "Mermaid Diagram Explorer" }), _jsx("p", { className: styles.copy, children: "Each architecture graph is pulled from the synced diagrams doc, rendered visually, and kept copy-paste friendly through raw Mermaid blocks." })] }), _jsx("div", { className: styles.stats, children: _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.statValue, children: diagrams.length }), _jsx("span", { className: styles.statLabel, children: "Diagrams" })] }) })] }), diagrams.length ? (diagrams.map((diagram, index) => (_jsx(MermaidDiagram, { diagram: diagram, index: index }, diagram.title)))) : (_jsx("p", { children: "No diagrams available." }))] }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MarkdownContent } from '../MarkdownContent/MarkdownContent';
import { SectionShell } from '../SectionShell/SectionShell';
import styles from './WikiDocument.styles.module.css';
function getStats(markdown) {
    return {
        headings: [...markdown.matchAll(/^##\s+/gm)].length,
        codeBlocks: [...markdown.matchAll(/```/gm)].length / 2,
        mermaidBlocks: [...markdown.matchAll(/```mermaid/gm)].length
    };
}
export function WikiDocument({ id, markdown, sourceLabel, title }) {
    const stats = getStats(markdown);
    return (_jsxs(SectionShell, { id: id, title: title, sourceLabel: sourceLabel, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { children: [_jsx("span", { className: styles.badge, children: "Wiki" }), _jsxs("h3", { className: styles.title, children: [title, " Document"] }), _jsx("p", { className: styles.copy, children: "Rendered directly from synced markdown so the portal stays aligned with the source docs." })] }), _jsxs("div", { className: styles.stats, children: [_jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.statValue, children: stats.headings }), _jsx("span", { className: styles.statLabel, children: "Sections" })] }), _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.statValue, children: stats.codeBlocks }), _jsx("span", { className: styles.statLabel, children: "Code Blocks" })] }), _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.statValue, children: stats.mermaidBlocks }), _jsx("span", { className: styles.statLabel, children: "Mermaid" })] })] })] }), _jsx("div", { className: styles.body, children: _jsx(MarkdownContent, { markdown: markdown }) })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { MermaidDiagram } from '../../components/MermaidDiagram/MermaidDiagram';
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import styles from './TechView.styles.module.css';
const TECH_SUB_TABS = [
    { id: 'diagrams', label: 'Diagrams' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'technicalSolutions', label: 'Technical Solutions' },
    { id: 'tools', label: 'Tools' },
    { id: 'db', label: 'DB' },
    { id: 'server', label: 'Server' },
    { id: 'technologies', label: 'Technologies' }
];
export function TechView({ content }) {
    const [subTab, setSubTab] = useState('diagrams');
    const tech = content.tech ?? {
        diagrams: content.diagrams ?? [],
        architecture: content.docs?.architecture ?? '',
        technicalSolutions: [content.docs?.architecture, content.docs?.design].filter(Boolean).join('\n\n---\n\n'),
        tools: [content.docs?.localDev, content.docs?.storybook, content.docs?.deployment].filter(Boolean).join('\n\n---\n\n'),
        db: '',
        server: '',
        technologies: ''
    };
    return (_jsxs("section", { className: styles.tech, "aria-labelledby": "tech-heading", children: [_jsx("h2", { id: "tech-heading", children: "Tech" }), _jsx("div", { className: styles.subTabs, children: TECH_SUB_TABS.map((tab) => (_jsx("button", { type: "button", className: `${styles.subTab} ${subTab === tab.id ? styles.active : ''}`, onClick: () => setSubTab(tab.id), children: tab.label }, tab.id))) }), _jsxs("div", { className: styles.panel, children: [subTab === 'diagrams' && (_jsx("div", { className: styles.diagrams, children: tech.diagrams?.length ? (tech.diagrams.map((diagram, index) => (_jsx(MermaidDiagram, { diagram: diagram, index: index }, diagram.title)))) : (_jsxs("p", { children: ["No diagrams available. Run ", _jsx("code", { children: "pnpm docs:sync" }), " and ensure docs/architecture/diagrams.md has Mermaid blocks."] })) })), subTab === 'architecture' && (_jsx(MarkdownContent, { markdown: tech.architecture || content.docs?.architecture || '', emptyMessage: "No architecture content." })), subTab === 'technicalSolutions' && (_jsx(MarkdownContent, { markdown: tech.technicalSolutions || '', emptyMessage: "No technical solutions content." })), subTab === 'tools' && (_jsx(MarkdownContent, { markdown: tech.tools || '', emptyMessage: "No tools content." })), subTab === 'db' && (_jsx(MarkdownContent, { markdown: tech.db || 'See Architecture for durability boundaries and schema.' })), subTab === 'server' && (_jsx(MarkdownContent, { markdown: tech.server || 'See Architecture for server responsibilities.' })), subTab === 'technologies' && (_jsx(MarkdownContent, { markdown: tech.technologies || 'React, R3F, Fastify, Postgres, Redis, Docker.' }))] })] }));
}

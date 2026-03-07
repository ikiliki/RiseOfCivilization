import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { PhaseDashboard } from '../../components/PhaseDashboard/PhaseDashboard';
import { extractRoadmapPhases } from '../../lib/dashboard';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import styles from './StepsSection.styles.module.css';
export function StepsSection({ planStatus, roadmapMarkdown, sourceLabel }) {
    const phases = useMemo(() => extractRoadmapPhases(roadmapMarkdown, planStatus.phase), [roadmapMarkdown, planStatus.phase]);
    const cards = [
        {
            title: 'Step 1: MVP',
            href: '#mvp',
            text: 'Baseline gameplay scope, deterministic shared world rules, and first-playable foundations.'
        },
        {
            title: 'Step 2: MULTI',
            href: '#multi',
            text: 'Completed: realtime presence, nearby sync, inspect flow, and stateless Redis fanout.'
        },
        {
            title: 'Current Phase',
            text: planStatus.phase,
            isPhase: true
        }
    ];
    return (_jsxs(SectionShell, { id: "steps", title: "Steps", sourceLabel: sourceLabel, children: [_jsxs("div", { className: styles.hero, children: [_jsx("h3", { children: "Implementation Progression" }), _jsx("p", { children: "This roadmap view groups the major delivery phases and shows where the current PBI sits relative to earlier completed milestones." })] }), _jsx("div", { className: `card-grid ${styles.cardGrid}`, children: cards.map((card) => card.href ? (_jsxs("a", { className: "card", href: card.href, children: [_jsx("h3", { children: card.title }), _jsx("p", { children: card.text })] }, card.title)) : (_jsxs("article", { className: "card", children: [_jsx("h3", { children: card.title }), card.isPhase ? _jsx("div", { className: "phase", children: card.text }) : _jsx("p", { children: card.text })] }, card.title))) }), _jsxs("div", { className: styles.phaseBoard, children: [_jsxs("div", { className: styles.boardHeader, children: [_jsx("h3", { children: "Phase Dashboard" }), _jsx("p", { children: "Roadmap milestones from the synced implementation roadmap." })] }), _jsx(PhaseDashboard, { phases: phases })] })] }));
}

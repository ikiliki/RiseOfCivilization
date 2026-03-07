import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { HomeView } from '../HomeView/HomeView';
import { PlanView } from '../PlanView/PlanView';
import { TechView } from '../TechView/TechView';
import styles from './AppLayout.styles.module.css';
export function AppLayout({ content }) {
    const [mainTab, setMainTab] = useState('home');
    return (_jsxs("div", { className: styles.layoutInner, children: [_jsxs("nav", { className: styles.tabs, "aria-label": "Main navigation", children: [_jsx("button", { type: "button", className: `${styles.tab} ${mainTab === 'home' ? styles.active : ''}`, onClick: () => setMainTab('home'), children: "Home" }), _jsx("button", { type: "button", className: `${styles.tab} ${mainTab === 'plan' ? styles.active : ''}`, onClick: () => setMainTab('plan'), children: "Plan" }), _jsx("button", { type: "button", className: `${styles.tab} ${mainTab === 'tech' ? styles.active : ''}`, onClick: () => setMainTab('tech'), children: "Tech" })] }), _jsxs("main", { className: styles.content, children: [mainTab === 'home' && _jsx(HomeView, { content: content }), mainTab === 'plan' && _jsx(PlanView, { content: content }), mainTab === 'tech' && _jsx(TechView, { content: content })] })] }));
}

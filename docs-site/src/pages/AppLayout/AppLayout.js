import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { HubView } from '../HubView/HubView';
import { TechView } from '../TechView/TechView';
import styles from './AppLayout.styles.module.css';
export function AppLayout({ content }) {
    const [mainTab, setMainTab] = useState('hub');
    return (_jsxs("div", { className: styles.layoutInner, children: [_jsxs("nav", { className: styles.tabs, "aria-label": "Main navigation", children: [_jsx("button", { type: "button", className: `${styles.tab} ${mainTab === 'hub' ? styles.active : ''}`, onClick: () => setMainTab('hub'), children: "Hub" }), _jsx("button", { type: "button", className: `${styles.tab} ${mainTab === 'tech' ? styles.active : ''}`, onClick: () => setMainTab('tech'), children: "Tech" })] }), _jsxs("main", { className: styles.content, children: [mainTab === 'hub' && _jsx(HubView, { content: content }), mainTab === 'tech' && _jsx(TechView, { content: content })] })] }));
}

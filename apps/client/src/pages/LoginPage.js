import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BUILD_LABEL } from '../config/version';
import { getRecentPlayers } from '../lib/recentPlayers';
import { ServerSelector } from '../components/ServerSelector';
import './LoginPage.styles.css';
export function LoginPage({ serverId, onSubmit, loading, error }) {
    const [username, setUsername] = useState('');
    const recentPlayers = getRecentPlayers(serverId);
    const handleSelectPlayer = (p) => {
        setUsername(p.username);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim().length >= 2) {
            void onSubmit(username.trim());
        }
    };
    return (_jsxs("div", { className: "login-page", children: [_jsx("span", { className: "login-build-version", children: BUILD_LABEL }), _jsxs("form", { className: "login-form", onSubmit: handleSubmit, children: [_jsx("h1", { children: "Rise Of Civilization" }), _jsx("p", { children: "First playable shared-world MVP" }), _jsx(ServerSelector, {}), _jsxs("div", { className: "login-recent", children: [_jsx("label", { children: "Recent logins" }), _jsx("div", { className: "login-recent-cards", children: recentPlayers.map((p) => (_jsxs("button", { type: "button", className: "login-player-card", onClick: () => handleSelectPlayer(p), disabled: loading, children: [_jsx("span", { className: "login-player-skin", style: { backgroundColor: p.skinColor } }), _jsx("span", { className: "login-player-name", children: p.username })] }, p.username))) })] }), _jsx("label", { htmlFor: "username", children: "Username" }), _jsx("input", { id: "username", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Enter username", minLength: 2, maxLength: 24 }), _jsx("button", { type: "submit", disabled: loading || username.trim().length < 2, children: loading ? 'Entering world...' : 'Start' }), error ? _jsx("small", { children: error }) : null] })] }));
}

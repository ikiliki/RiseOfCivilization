import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './GameOnlinePanel.styles.css';
export function GameOnlinePanel({ onlineCount, connected }) {
    return (_jsxs("div", { className: "game-online-panel", children: [_jsx("span", { className: "game-online-label", children: "Online" }), _jsx("span", { className: "game-online-count", children: connected ? onlineCount : '—' })] }));
}

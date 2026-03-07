import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './PlayerCard.styles.css';
/**
 * Compact player info card: name + skin color dot.
 */
export function PlayerCard({ username, skinColor }) {
    return (_jsxs("div", { className: "roc-player-card", children: [skinColor && (_jsx("span", { className: "roc-player-card-skin", style: { backgroundColor: skinColor }, title: `Skin: ${skinColor}` })), _jsx("span", { className: "roc-player-card-name", children: username })] }));
}

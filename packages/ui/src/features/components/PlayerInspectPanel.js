import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './PlayerInspectPanel.styles.css';
import { Button } from '../../components/Button';
import { CurrencyDisplay } from '../../components/CurrencyDisplay';
import { StatDisplay } from '../../components/StatDisplay';
function biomeLabel(biome) {
    if (!biome)
        return '—';
    return biome.charAt(0).toUpperCase() + biome.slice(1);
}
export function PlayerInspectPanel({ open, profile, loading, onClose }) {
    if (!open)
        return null;
    return (_jsx("div", { className: "roc-inspect-backdrop", onClick: onClose, children: _jsxs("div", { className: "roc-inspect-panel", onClick: (e) => e.stopPropagation(), children: [_jsx("h2", { children: "Player Profile" }), loading && _jsx("p", { className: "roc-inspect-loading", children: "Loading\u2026" }), !loading && profile && (_jsxs("div", { className: "roc-inspect-content", children: [_jsxs("div", { className: "roc-inspect-name", children: [profile.username, profile.skinColor && (_jsx("span", { className: "roc-inspect-skin-dot", style: { backgroundColor: profile.skinColor }, title: `Skin: ${profile.skinColor}` }))] }), _jsxs("div", { className: "roc-inspect-id", children: ["ID: ", profile.userId.slice(0, 8), "\u2026"] }), _jsxs("div", { className: "roc-inspect-stats", children: [_jsx(CurrencyDisplay, { amount: profile.currency }), _jsx(StatDisplay, { label: "Energy", value: profile.stats.energy }), _jsx(StatDisplay, { label: "Hydration", value: profile.stats.hydration })] }), _jsxs("div", { className: "roc-inspect-location", children: [_jsx("span", { children: "Location" }), _jsxs("span", { children: ["Chunk (", profile.chunkX ?? '—', ", ", profile.chunkY ?? '—', ") \u00B7 ", biomeLabel(profile.biome)] })] })] })), !loading && !profile && _jsx("p", { className: "roc-inspect-empty", children: "No profile data" }), _jsx("div", { className: "roc-inspect-actions", children: _jsx(Button, { onClick: onClose, children: "Close" }) })] }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './HudShell.styles.css';
import { Button } from '../components/Button';
import { CurrencyDisplay } from '../components/CurrencyDisplay';
import { PlayerCard } from '../components/PlayerCard';
import { StatDisplay } from '../components/StatDisplay';
export function HudShell({ username, skinColor, currency, energy, hydration, onOpenSettings }) {
    return (_jsxs("div", { className: "roc-hud-shell", children: [_jsxs("div", { className: "roc-hud-top", children: [_jsxs("div", { className: "roc-hud-left", children: [username && _jsx(PlayerCard, { username: username, skinColor: skinColor }), _jsx(CurrencyDisplay, { amount: currency })] }), _jsxs("div", { className: "roc-hud-stats", children: [_jsx(StatDisplay, { label: "Energy", value: energy }), _jsx(StatDisplay, { label: "Hydration", value: hydration })] })] }), _jsx("div", { className: "roc-hud-bottom", children: _jsx(Button, { onClick: onOpenSettings, children: "Settings" }) })] }));
}

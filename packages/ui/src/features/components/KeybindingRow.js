import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './KeybindingRow.styles.css';
export function KeybindingRow({ action, keyValue, listening = false, conflict = false, onStartCapture }) {
    const label = action
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
    return (_jsxs("div", { className: `roc-keybind-row ${conflict ? 'roc-keybind-row--conflict' : ''}`, children: [_jsx("span", { children: label }), _jsx("button", { onClick: onStartCapture, type: "button", children: listening ? 'Press key...' : keyValue }), conflict ? _jsx("small", { children: "Duplicate key" }) : null] }));
}

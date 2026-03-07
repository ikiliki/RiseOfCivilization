import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import './GameTopToolbar.styles.css';
export function GameTopToolbar({ credits, onProfile, onSettings, onItems, onEquipment, itemsShortcutLabel, equipmentShortcutLabel }) {
    return (_jsxs("div", { className: "game-top-toolbar", children: [_jsxs("span", { className: "game-top-toolbar-credits", children: ["Credits: ", credits] }), _jsx("button", { type: "button", onClick: onProfile, children: "Profile" }), _jsx("button", { type: "button", onClick: onSettings, children: "Settings" }), _jsxs("button", { type: "button", onClick: onItems, children: ["Items (", itemsShortcutLabel, ")"] }), _jsxs("button", { type: "button", onClick: onEquipment, children: ["Equip (", equipmentShortcutLabel, ")"] })] }));
}

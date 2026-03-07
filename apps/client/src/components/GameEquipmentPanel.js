import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './GameEquipmentPanel.styles.css';
function displayName(assetId) {
    if (!assetId || assetId === 'none')
        return 'Empty';
    if (assetId === 'cap')
        return 'Blue Cap';
    if (assetId === 'crown')
        return 'Royal Crown';
    if (assetId === 'sneakers')
        return 'White Sneakers';
    if (assetId === 'boots')
        return 'Traveler Boots';
    return assetId;
}
export function GameEquipmentPanel({ open, equipped, onUnequip, onClose }) {
    if (!open)
        return null;
    return (_jsxs("div", { className: "game-equipment-panel", children: [_jsxs("div", { className: "game-equipment-header", children: [_jsx("h3", { children: "Equipment" }), _jsx("button", { type: "button", onClick: onClose, children: "x" })] }), _jsxs("div", { className: "game-equipment-slot", children: [_jsx("span", { children: "Hat" }), _jsx("span", { children: displayName(equipped.hatAssetId) }), _jsx("button", { type: "button", onClick: () => onUnequip('hat'), disabled: !equipped.hatAssetId || equipped.hatAssetId === 'none', children: "Unequip" })] }), _jsxs("div", { className: "game-equipment-slot", children: [_jsx("span", { children: "Shoes" }), _jsx("span", { children: displayName(equipped.shoesAssetId) }), _jsx("button", { type: "button", onClick: () => onUnequip('shoes'), disabled: !equipped.shoesAssetId || equipped.shoesAssetId === 'none', children: "Unequip" })] })] }));
}

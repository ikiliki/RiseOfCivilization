import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ItemCard } from './ItemCard';
import './GameItemsPanel.styles.css';
export function GameItemsPanel({ open, items, equipped, onEquip, onClose }) {
    if (!open)
        return null;
    return (_jsxs("div", { className: "game-items-panel", children: [_jsxs("div", { className: "game-items-header", children: [_jsx("h3", { children: "Items" }), _jsx("button", { type: "button", onClick: onClose, children: "x" })] }), _jsx("div", { className: "game-items-grid", children: items.map((item) => {
                    const isEquipped = (item.slot === 'hat' && equipped.hatAssetId === item.assetId) ||
                        (item.slot === 'shoes' && equipped.shoesAssetId === item.assetId);
                    return (_jsx(ItemCard, { item: item, equipped: isEquipped, onEquip: () => onEquip(item) }, item.id));
                }) })] }));
}

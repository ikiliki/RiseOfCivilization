import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './ItemCard.styles.css';
function rarityClass(rarity) {
    if (rarity === 'epic')
        return 'item-card--epic';
    if (rarity === 'rare')
        return 'item-card--rare';
    return 'item-card--common';
}
export function ItemCard({ item, equipped = false, onEquip }) {
    return (_jsxs("button", { type: "button", className: `item-card ${rarityClass(item.rarity)} ${equipped ? 'item-card--equipped' : ''}`, onClick: onEquip, children: [_jsx("span", { className: "item-card-name", children: item.name }), _jsxs("span", { className: "item-card-meta", children: [item.slot, " \u00B7 ", item.rarity] }), _jsx("span", { className: "item-card-action", children: equipped ? 'Equipped' : 'Equip' })] }));
}

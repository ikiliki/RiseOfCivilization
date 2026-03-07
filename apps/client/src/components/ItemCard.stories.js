import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ItemCard } from './ItemCard';
const meta = {
    title: 'Game/ItemCard',
    component: ItemCard,
    parameters: {
        layout: 'centered',
        backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#0a1220' }] }
    }
};
export default meta;
const BLUE_CAP = {
    id: 'cap',
    name: 'Blue Cap',
    slot: 'hat',
    assetId: 'cap',
    rarity: 'common'
};
const ROYAL_CROWN = {
    id: 'crown',
    name: 'Royal Crown',
    slot: 'hat',
    assetId: 'crown',
    rarity: 'epic'
};
const WHITE_SNEAKERS = {
    id: 'sneakers',
    name: 'White Sneakers',
    slot: 'shoes',
    assetId: 'sneakers',
    rarity: 'common'
};
const TRAVELER_BOOTS = {
    id: 'boots',
    name: 'Traveler Boots',
    slot: 'shoes',
    assetId: 'boots',
    rarity: 'rare'
};
export const BlueCap = {
    args: { item: BLUE_CAP }
};
export const BlueCapEquipped = {
    args: { item: BLUE_CAP, equipped: true }
};
export const RoyalCrown = {
    args: { item: ROYAL_CROWN }
};
export const RoyalCrownEquipped = {
    args: { item: ROYAL_CROWN, equipped: true }
};
export const WhiteSneakers = {
    args: { item: WHITE_SNEAKERS }
};
export const WhiteSneakersEquipped = {
    args: { item: WHITE_SNEAKERS, equipped: true }
};
export const TravelerBoots = {
    args: { item: TRAVELER_BOOTS }
};
export const TravelerBootsEquipped = {
    args: { item: TRAVELER_BOOTS, equipped: true }
};
export const AllItems = {
    render: () => (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: [_jsx(ItemCard, { item: BLUE_CAP }), _jsx(ItemCard, { item: ROYAL_CROWN, equipped: true }), _jsx(ItemCard, { item: WHITE_SNEAKERS }), _jsx(ItemCard, { item: TRAVELER_BOOTS, equipped: true })] }))
};

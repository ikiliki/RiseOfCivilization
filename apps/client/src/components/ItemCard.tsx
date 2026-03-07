import './ItemCard.styles.css';

export interface CosmeticInventoryItem {
  id: string;
  name: string;
  slot: 'hat' | 'shoes';
  assetId: string;
  rarity: 'common' | 'rare' | 'epic';
}

interface ItemCardProps {
  item: CosmeticInventoryItem;
  equipped?: boolean;
  onEquip?: () => void;
}

function rarityClass(rarity: CosmeticInventoryItem['rarity']): string {
  if (rarity === 'epic') return 'item-card--epic';
  if (rarity === 'rare') return 'item-card--rare';
  return 'item-card--common';
}

export function ItemCard({ item, equipped = false, onEquip }: ItemCardProps) {
  return (
    <button
      type="button"
      className={`item-card ${rarityClass(item.rarity)} ${equipped ? 'item-card--equipped' : ''}`}
      onClick={onEquip}
    >
      <span className="item-card-name">{item.name}</span>
      <span className="item-card-meta">
        {item.slot} · {item.rarity}
      </span>
      <span className="item-card-action">{equipped ? 'Equipped' : 'Equip'}</span>
    </button>
  );
}

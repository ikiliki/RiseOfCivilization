import { ItemCard, type CosmeticInventoryItem } from './ItemCard';
import './GameItemsPanel.styles.css';

export type { CosmeticInventoryItem };

interface GameItemsPanelProps {
  open: boolean;
  items: CosmeticInventoryItem[];
  equipped: {
    hatAssetId?: string;
    shoesAssetId?: string;
  };
  onEquip: (item: CosmeticInventoryItem) => void;
  onClose: () => void;
}

export function GameItemsPanel({ open, items, equipped, onEquip, onClose }: GameItemsPanelProps) {
  if (!open) return null;
  return (
    <div className="game-items-panel">
      <div className="game-items-header">
        <h3>Items</h3>
        <button type="button" onClick={onClose}>
          x
        </button>
      </div>
      <div className="game-items-grid">
        {items.map((item) => {
          const isEquipped =
            (item.slot === 'hat' && equipped.hatAssetId === item.assetId) ||
            (item.slot === 'shoes' && equipped.shoesAssetId === item.assetId);
          return (
            <ItemCard
              key={item.id}
              item={item}
              equipped={isEquipped}
              onEquip={() => onEquip(item)}
            />
          );
        })}
      </div>
    </div>
  );
}


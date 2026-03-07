import './GameEquipmentPanel.styles.css';

export interface EquippedVisuals {
  hatAssetId?: string;
  shoesAssetId?: string;
}

interface GameEquipmentPanelProps {
  open: boolean;
  equipped: EquippedVisuals;
  onUnequip: (slot: 'hat' | 'shoes') => void;
  onClose: () => void;
}

function displayName(assetId?: string): string {
  if (!assetId || assetId === 'none') return 'Empty';
  if (assetId === 'cap') return 'Blue Cap';
  if (assetId === 'crown') return 'Royal Crown';
  if (assetId === 'sneakers') return 'White Sneakers';
  if (assetId === 'boots') return 'Traveler Boots';
  return assetId;
}

export function GameEquipmentPanel({ open, equipped, onUnequip, onClose }: GameEquipmentPanelProps) {
  if (!open) return null;
  return (
    <div className="game-equipment-panel">
      <div className="game-equipment-header">
        <h3>Equipment</h3>
        <button type="button" onClick={onClose}>
          x
        </button>
      </div>
      <div className="game-equipment-slot">
        <span>Hat</span>
        <span>{displayName(equipped.hatAssetId)}</span>
        <button
          type="button"
          onClick={() => onUnequip('hat')}
          disabled={!equipped.hatAssetId || equipped.hatAssetId === 'none'}
        >
          Unequip
        </button>
      </div>
      <div className="game-equipment-slot">
        <span>Shoes</span>
        <span>{displayName(equipped.shoesAssetId)}</span>
        <button
          type="button"
          onClick={() => onUnequip('shoes')}
          disabled={!equipped.shoesAssetId || equipped.shoesAssetId === 'none'}
        >
          Unequip
        </button>
      </div>
    </div>
  );
}


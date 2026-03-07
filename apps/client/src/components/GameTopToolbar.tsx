import './GameTopToolbar.styles.css';

interface GameTopToolbarProps {
  credits: number;
  onProfile: () => void;
  onSettings: () => void;
  onItems: () => void;
  onEquipment: () => void;
  itemsShortcutLabel: string;
  equipmentShortcutLabel: string;
}

export function GameTopToolbar({
  credits,
  onProfile,
  onSettings,
  onItems,
  onEquipment,
  itemsShortcutLabel,
  equipmentShortcutLabel
}: GameTopToolbarProps) {
  return (
    <div className="game-top-toolbar">
      <span className="game-top-toolbar-credits">Credits: {credits}</span>
      <button type="button" onClick={onProfile}>
        Profile
      </button>
      <button type="button" onClick={onSettings}>
        Settings
      </button>
      <button type="button" onClick={onItems}>
        Items ({itemsShortcutLabel})
      </button>
      <button type="button" onClick={onEquipment}>
        Equip ({equipmentShortcutLabel})
      </button>
    </div>
  );
}


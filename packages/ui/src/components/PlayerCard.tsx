import './PlayerCard.styles.css';

interface PlayerCardProps {
  username: string;
  skinColor?: string;
}

/**
 * Compact player info card: name + skin color dot.
 */
export function PlayerCard({ username, skinColor }: PlayerCardProps) {
  return (
    <div className="roc-player-card">
      {skinColor && (
        <span
          className="roc-player-card-skin"
          style={{ backgroundColor: skinColor }}
          title={`Skin: ${skinColor}`}
        />
      )}
      <span className="roc-player-card-name">{username}</span>
    </div>
  );
}

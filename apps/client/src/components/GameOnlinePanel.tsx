import './GameOnlinePanel.styles.css';

interface GameOnlinePanelProps {
  onlineCount: number;
  connected: boolean;
}

export function GameOnlinePanel({ onlineCount, connected }: GameOnlinePanelProps) {
  return (
    <div className="game-online-panel">
      <span className="game-online-label">Online</span>
      <span className="game-online-count">{connected ? onlineCount : '—'}</span>
    </div>
  );
}

import './HudShell.styles.css';
import { Button } from '../components/Button';
import { CurrencyDisplay } from '../components/CurrencyDisplay';
import { PlayerCard } from '../components/PlayerCard';
import { StatDisplay } from '../components/StatDisplay';

interface HudShellProps {
  username?: string;
  skinColor?: string;
  currency: number;
  energy: number;
  hydration: number;
  onOpenSettings: () => void;
}

export function HudShell({ username, skinColor, currency, energy, hydration, onOpenSettings }: HudShellProps) {
  return (
    <div className="roc-hud-shell">
      <div className="roc-hud-top">
        <div className="roc-hud-left">
          {username && <PlayerCard username={username} skinColor={skinColor} />}
          <CurrencyDisplay amount={currency} />
        </div>
        <div className="roc-hud-stats">
          <StatDisplay label="Energy" value={energy} />
          <StatDisplay label="Hydration" value={hydration} />
        </div>
      </div>
      <div className="roc-hud-bottom">
        <Button onClick={onOpenSettings}>Settings</Button>
      </div>
    </div>
  );
}

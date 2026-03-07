import './PlayerInspectPanel.styles.css';
import { Button } from '../../components/Button';
import { CurrencyDisplay } from '../../components/CurrencyDisplay';
import { StatDisplay } from '../../components/StatDisplay';
import type { InspectProfilePayload } from '@roc/shared-types';

interface PlayerInspectPanelProps {
  open: boolean;
  profile: InspectProfilePayload | null;
  loading?: boolean;
  onClose: () => void;
}

function biomeLabel(biome?: string): string {
  if (!biome) return '—';
  return biome.charAt(0).toUpperCase() + biome.slice(1);
}

export function PlayerInspectPanel({ open, profile, loading, onClose }: PlayerInspectPanelProps) {
  if (!open) return null;

  return (
    <div className="roc-inspect-backdrop" onClick={onClose}>
      <div className="roc-inspect-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Player Profile</h2>
        {loading && <p className="roc-inspect-loading">Loading…</p>}
        {!loading && profile && (
          <div className="roc-inspect-content">
            <div className="roc-inspect-name">
              {profile.username}
              {profile.skinColor && (
                <span
                  className="roc-inspect-skin-dot"
                  style={{ backgroundColor: profile.skinColor }}
                  title={`Skin: ${profile.skinColor}`}
                />
              )}
            </div>
            <div className="roc-inspect-id">ID: {profile.userId.slice(0, 8)}…</div>
            <div className="roc-inspect-stats">
              <CurrencyDisplay amount={profile.currency} />
              <StatDisplay label="Energy" value={profile.stats.energy} />
              <StatDisplay label="Hydration" value={profile.stats.hydration} />
            </div>
            <div className="roc-inspect-location">
              <span>Location</span>
              <span>
                Chunk ({profile.chunkX ?? '—'}, {profile.chunkY ?? '—'}) · {biomeLabel(profile.biome)}
              </span>
            </div>
          </div>
        )}
        {!loading && !profile && <p className="roc-inspect-empty">No profile data</p>}
        <div className="roc-inspect-actions">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

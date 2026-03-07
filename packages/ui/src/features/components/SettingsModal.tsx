import './SettingsModal.styles.css';
import { Button } from '../../components/Button';
import { KeybindingRow } from './KeybindingRow';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
import type { KeybindingMap, PlayerAssetLoadout, PlayerSettings } from '@roc/shared-types';

interface SettingsModalProps {
  open: boolean;
  keybindings: KeybindingMap;
  settings: PlayerSettings;
  assets: PlayerAssetLoadout;
  listeningAction: keyof KeybindingMap | null;
  conflicts: (keyof KeybindingMap)[];
  onSettingsChange: (next: PlayerSettings) => void;
  onAssetsChange: (next: PlayerAssetLoadout) => void;
  onCaptureStart: (action: keyof KeybindingMap) => void;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
  onLogout?: () => void;
}

export function SettingsModal({
  open,
  keybindings,
  settings,
  assets,
  listeningAction,
  conflicts,
  onSettingsChange,
  onAssetsChange,
  onCaptureStart,
  onReset,
  onApply,
  onClose,
  onLogout
}: SettingsModalProps) {
  if (!open) return null;
  const normalizedAssets = assets ?? DEFAULT_PLAYER_ASSET_LOADOUT;
  return (
    <div className="roc-settings-backdrop">
      <div className="roc-settings-modal">
        <h2>Settings</h2>
        <p>Master volume: {Math.round(settings.masterVolume * 100)}%</p>
        <label className="roc-settings-toggle">
          <input
            type="checkbox"
            checked={settings.showDebugOverlay}
            onChange={(event) =>
              onSettingsChange({
                ...settings,
                showDebugOverlay: event.target.checked
              })
            }
          />
          <span>Developer mode (debug overlay)</span>
        </label>
        <div className="roc-settings-assets">
          <h3>Player Assets</h3>
          <p className="roc-settings-assets-note">Choose built-in cosmetics now. Custom imports can be added later.</p>
          <label className="roc-settings-field">
            <span>Hat</span>
            <select
              value={normalizedAssets.hatAssetId}
              onChange={(event) =>
                onAssetsChange({
                  ...normalizedAssets,
                  hatAssetId: event.target.value
                })
              }
            >
              <option value="none">None</option>
              <option value="cap">Cap</option>
              <option value="crown">Crown</option>
            </select>
          </label>
          <label className="roc-settings-field">
            <span>Shoes</span>
            <select
              value={normalizedAssets.shoesAssetId}
              onChange={(event) =>
                onAssetsChange({
                  ...normalizedAssets,
                  shoesAssetId: event.target.value
                })
              }
            >
              <option value="none">None</option>
              <option value="sneakers">Sneakers</option>
              <option value="boots">Boots</option>
            </select>
          </label>
        </div>
        <div>
          {Object.entries(keybindings).map(([action, keyValue]) => (
            <KeybindingRow
              key={action}
              action={action}
              keyValue={keyValue}
              listening={listeningAction === action}
              conflict={conflicts.includes(action as keyof KeybindingMap)}
              onStartCapture={() => onCaptureStart(action as keyof KeybindingMap)}
            />
          ))}
        </div>
        <div className="roc-settings-actions">
          <Button onClick={onReset}>Reset Defaults</Button>
          <Button onClick={onApply}>Apply</Button>
          {onLogout && (
            <Button onClick={onLogout} className="roc-settings-logout">
              Log out
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

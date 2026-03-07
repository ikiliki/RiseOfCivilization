import React from 'react';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
import type { InspectProfilePayload, KeybindingMap, PlayerAssetLoadout, PlayerSettings } from '@roc/shared-types';
import { HudShell } from './HudShell';
import { PlayerInspectPanel } from '../features/components/PlayerInspectPanel';
import { SettingsModal } from '../features/components/SettingsModal';
import './GameLayout.styles.css';

const DEFAULT_KEYBINDINGS: KeybindingMap = {
  moveForward: 'KeyW',
  moveBackward: 'KeyS',
  moveLeft: 'KeyA',
  moveRight: 'KeyD',
  toggleEquipment: 'KeyE',
  toggleItems: 'KeyI',
  toggleSettings: 'Backslash'
};

export interface GameLayoutProps {
  /** Content for the map area (e.g. 3D canvas or MockMap) */
  children: React.ReactNode;
  username?: string;
  skinColor?: string;
  currency?: number;
  energy?: number;
  hydration?: number;
  saveFeedback?: string;
  connected?: boolean;
  inspectOpen?: boolean;
  inspectProfile?: InspectProfilePayload | null;
  inspectLoading?: boolean;
  settingsOpen?: boolean;
  settings?: PlayerSettings;
  assets?: PlayerAssetLoadout;
  keybindings?: KeybindingMap;
  onOpenSettings?: () => void;
  onCloseInspect?: () => void;
  onCloseSettings?: () => void;
  onLogout?: () => void;
}

export function GameLayout({
  children,
  username,
  skinColor,
  currency = 120,
  energy = 100,
  hydration = 80,
  saveFeedback = 'Connected',
  connected = true,
  inspectOpen = false,
  inspectProfile = null,
  inspectLoading = false,
  settingsOpen = false,
  settings = { showDebugOverlay: false, masterVolume: 0.8 },
  assets = DEFAULT_PLAYER_ASSET_LOADOUT,
  keybindings = DEFAULT_KEYBINDINGS,
  onOpenSettings = () => {},
  onCloseInspect = () => {},
  onCloseSettings = () => {},
  onLogout
}: GameLayoutProps) {
  const [listeningAction, setListeningAction] = React.useState<keyof KeybindingMap | null>(null);
  const [localKeybindings, setLocalKeybindings] = React.useState(keybindings);
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [localAssets, setLocalAssets] = React.useState<PlayerAssetLoadout>(assets);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  React.useEffect(() => {
    setLocalAssets(assets);
  }, [assets]);

  const conflicts = React.useMemo(() => {
    const used = new Map<string, keyof KeybindingMap>();
    const duplicates: (keyof KeybindingMap)[] = [];
    (Object.keys(localKeybindings) as (keyof KeybindingMap)[]).forEach((action) => {
      const key = localKeybindings[action];
      if (used.has(key)) duplicates.push(action);
      else used.set(key, action);
    });
    return duplicates;
  }, [localKeybindings]);

  React.useEffect(() => {
    if (!listeningAction) return;
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      setLocalKeybindings((prev) => ({ ...prev, [listeningAction]: event.code }));
      setListeningAction(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [listeningAction]);

  return (
    <div className="roc-game-layout">
      <div className="roc-game-layout-map">{children}</div>
      <HudShell
        username={username}
        skinColor={skinColor}
        currency={currency}
        energy={energy}
        hydration={hydration}
        onOpenSettings={onOpenSettings}
      />
      <div className="roc-game-layout-status">
        {saveFeedback}
        {connected && <span className="roc-game-layout-status-online"> · Online</span>}
      </div>
      <PlayerInspectPanel
        open={inspectOpen}
        profile={inspectProfile}
        loading={inspectLoading}
        onClose={onCloseInspect}
      />
      <SettingsModal
        open={settingsOpen}
        settings={localSettings}
        assets={localAssets}
        keybindings={localKeybindings}
        listeningAction={listeningAction}
        conflicts={conflicts}
        onSettingsChange={setLocalSettings}
        onAssetsChange={setLocalAssets}
        onCaptureStart={setListeningAction}
        onReset={() => setLocalKeybindings(DEFAULT_KEYBINDINGS)}
        onApply={() => {
          onCloseSettings();
        }}
        onClose={onCloseSettings}
        onLogout={onLogout}
      />
    </div>
  );
}

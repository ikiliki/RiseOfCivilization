import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
import type { BootstrapResponse, InspectProfilePayload, KeybindingMap, PlayerAssetLoadout, Vec3 } from '@roc/shared-types';
import { PlayerInspectPanel, SettingsModal, SocketStatusPanel } from '@roc/ui';
import { inspectPlayer, savePlayer } from '../api';
import { GameChatPanel } from '../components/GameChatPanel';
import type { CosmeticInventoryItem } from '../components/GameItemsPanel';
import { GameItemsPanel } from '../components/GameItemsPanel';
import { GameEquipmentPanel } from '../components/GameEquipmentPanel';
import { GameScene } from '../components/GameScene';
import { GameTopToolbar } from '../components/GameTopToolbar';
import { useMultiplayer } from '../hooks/useMultiplayer';
import './GamePage.styles.css';

interface GamePageProps {
  token: string;
  bootstrapData: BootstrapResponse;
  onLogout?: () => void;
}

const DEFAULT_KEYBINDINGS: KeybindingMap = {
  moveForward: 'KeyW',
  moveBackward: 'KeyS',
  moveLeft: 'KeyA',
  moveRight: 'KeyD',
  toggleEquipment: 'KeyE',
  toggleItems: 'KeyI',
  toggleSettings: 'Backslash'
};

const COSMETIC_POOL: CosmeticInventoryItem[] = [
  { id: 'hat-cap', name: 'Blue Cap', slot: 'hat', assetId: 'cap', rarity: 'common' },
  { id: 'hat-crown', name: 'Royal Crown', slot: 'hat', assetId: 'crown', rarity: 'epic' },
  { id: 'shoes-sneakers', name: 'White Sneakers', slot: 'shoes', assetId: 'sneakers', rarity: 'common' },
  { id: 'shoes-boots', name: 'Traveler Boots', slot: 'shoes', assetId: 'boots', rarity: 'rare' }
];

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function normalizeKeybindings(next: Partial<KeybindingMap> | undefined): KeybindingMap {
  return {
    ...DEFAULT_KEYBINDINGS,
    ...(next ?? {})
  };
}

function buildStarterInventory(username: string): {
  items: CosmeticInventoryItem[];
  equipped: PlayerAssetLoadout;
} {
  const normalized = username.trim().toLowerCase();
  const seeded = hashString(normalized);
  const always = [
    COSMETIC_POOL[0], // cap
    COSMETIC_POOL[2] // sneakers
  ];
  const extras = [COSMETIC_POOL[1], COSMETIC_POOL[3]];
  const pickedExtra = extras[seeded % extras.length];
  const items = [...always, pickedExtra];

  const equipHat = normalized === 'ikiliki' ? 'crown' : seeded % 2 === 0 ? 'cap' : 'crown';
  const equipShoes = normalized === 'ikiliki1' ? 'boots' : seeded % 3 === 0 ? 'boots' : 'sneakers';

  return {
    items,
    equipped: {
      hatAssetId: equipHat,
      shoesAssetId: equipShoes
    }
  };
}

function keyCodeLabel(code: string): string {
  if (code.startsWith('Key')) return code.slice(3).toUpperCase();
  if (code === 'Backslash') return '\\';
  return code;
}

export function GamePage({ token, bootstrapData, onLogout }: GamePageProps) {
  const normalizedUsername = bootstrapData.player.username.trim().toLowerCase();
  const starter = useMemo(() => buildStarterInventory(bootstrapData.player.username), [bootstrapData.player.username]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(
    normalizedUsername === 'ikiliki' || normalizedUsername === 'ikiliki1'
  );
  const [settings, setSettings] = useState({
    ...bootstrapData.player.settings,
    showDebugOverlay: true
  });
  const [keybindings, setKeybindings] = useState<KeybindingMap>(
    normalizeKeybindings(bootstrapData.player.keybindings)
  );
  const [assets, setAssets] = useState<PlayerAssetLoadout>(
    normalizedUsername === 'ikiliki' || normalizedUsername === 'ikiliki1'
      ? starter.equipped
      : bootstrapData.player.assets ?? starter.equipped ?? DEFAULT_PLAYER_ASSET_LOADOUT
  );
  const [items] = useState<CosmeticInventoryItem[]>(starter.items);
  const [listeningAction, setListeningAction] = useState<keyof KeybindingMap | null>(null);
  const positionRef = useRef<Vec3>(bootstrapData.spawn);
  const directionRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const [localPosition, setLocalPosition] = useState<Vec3>(bootstrapData.spawn);
  const [saveFeedback, setSaveFeedback] = useState('Connected');
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);
  const [inspectProfile, setInspectProfile] = useState<InspectProfilePayload | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const handleForcedLogout = (reason?: string) => {
    setSaveFeedback(reason ? `Logged out: ${reason}` : 'Logged out');
    onLogout?.();
  };

  const {
    remotePlayersMapRef,
    remotePlayerIds,
    connected,
    onlineCount,
    chatMessages,
    sendChat,
    disconnect,
    sentUpdates,
    receivedUpdates,
    socketLogs
  } = useMultiplayer({
    token,
    localUserId: bootstrapData.player.userId,
    positionRef,
    directionRef,
    enabled: true,
    onForcedLogout: handleForcedLogout
  });

  const conflicts = useMemo(() => {
    const used = new Map<string, keyof KeybindingMap>();
    const duplicates: (keyof KeybindingMap)[] = [];
    (Object.keys(keybindings) as (keyof KeybindingMap)[]).forEach((action) => {
      const key = keybindings[action];
      if (used.has(key)) duplicates.push(action);
      else used.set(key, action);
    });
    return duplicates;
  }, [keybindings]);

  useEffect(() => {
    if (!listeningAction) return;
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      setKeybindings((prev) => ({
        ...prev,
        [listeningAction]: event.code
      }));
      setListeningAction(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [listeningAction]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (listeningAction) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.code === keybindings.toggleItems) {
        event.preventDefault();
        setItemsOpen((v) => !v);
      } else if (event.code === keybindings.toggleEquipment) {
        event.preventDefault();
        setEquipmentOpen((v) => !v);
      } else if (event.code === keybindings.toggleSettings) {
        event.preventDefault();
        setSettingsOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [keybindings.toggleEquipment, keybindings.toggleItems, keybindings.toggleSettings, listeningAction]);

  useEffect(() => {
    if (!inspectUserId) return;
    setInspectLoading(true);
    setInspectProfile(null);
    inspectPlayer(token, inspectUserId)
      .then(setInspectProfile)
      .catch(() => setInspectProfile(null))
      .finally(() => setInspectLoading(false));
  }, [token, inspectUserId]);

  useEffect(() => {
    const interval = setInterval(() => {
      void savePlayer(token, {
        position: positionRef.current,
        settings,
        keybindings,
        assets
      })
        .then(() => setSaveFeedback('Autosaved'))
        .catch(() => setSaveFeedback('Save failed'));
    }, 15000);
    return () => clearInterval(interval);
  }, [token, settings, keybindings, assets]);

  const equipItem = (item: CosmeticInventoryItem) => {
    setAssets((prev) => ({
      ...prev,
      hatAssetId: item.slot === 'hat' ? item.assetId : prev.hatAssetId,
      shoesAssetId: item.slot === 'shoes' ? item.assetId : prev.shoesAssetId
    }));
  };

  const unequipSlot = (slot: 'hat' | 'shoes') => {
    setAssets((prev) => ({
      ...prev,
      hatAssetId: slot === 'hat' ? 'none' : prev.hatAssetId,
      shoesAssetId: slot === 'shoes' ? 'none' : prev.shoesAssetId
    }));
  };

  const hp = bootstrapData.player.stats.hydration;
  const energy = bootstrapData.player.stats.energy;
  const level = Math.max(1, Math.floor(bootstrapData.player.currency / 250) + 1);
  const exp = bootstrapData.player.currency % 250;
  const expPercent = (exp / 250) * 100;

  return (
    <div className="game-page">
      <GameScene
        token={token}
        worldSeed={bootstrapData.world.worldSeed}
        initialPosition={bootstrapData.spawn}
        keybindings={keybindings}
        onPositionChange={(position) => {
          positionRef.current = position;
          setLocalPosition(position);
        }}
        positionRef={positionRef}
        directionRef={directionRef}
        remotePlayersMapRef={remotePlayersMapRef}
        remotePlayerIds={remotePlayerIds.filter((id) => id !== bootstrapData.player.userId)}
        onPlayerSelected={setInspectUserId}
        localSkinColor={bootstrapData.player.skin?.colorHex}
        localUsername={bootstrapData.player.username}
        localAssets={assets}
      />
      <GameTopToolbar
        credits={bootstrapData.player.currency}
        onProfile={() => setInspectUserId(bootstrapData.player.userId)}
        onSettings={() => setSettingsOpen(true)}
        onItems={() => setItemsOpen((v) => !v)}
        onEquipment={() => setEquipmentOpen((v) => !v)}
        itemsShortcutLabel={keyCodeLabel(keybindings.toggleItems)}
        equipmentShortcutLabel={keyCodeLabel(keybindings.toggleEquipment)}
      />
      <div className="game-shortcut-hint">
        Shortcuts: {keyCodeLabel(keybindings.toggleItems)} items, {keyCodeLabel(keybindings.toggleEquipment)} equip,{' '}
        {keyCodeLabel(keybindings.toggleSettings)} settings
      </div>
      <GameItemsPanel
        open={itemsOpen}
        items={items}
        equipped={{ hatAssetId: assets.hatAssetId, shoesAssetId: assets.shoesAssetId }}
        onEquip={equipItem}
        onClose={() => setItemsOpen(false)}
      />
      <GameEquipmentPanel
        open={equipmentOpen}
        equipped={{ hatAssetId: assets.hatAssetId, shoesAssetId: assets.shoesAssetId }}
        onUnequip={unequipSlot}
        onClose={() => setEquipmentOpen(false)}
      />
      <GameChatPanel messages={chatMessages} onSend={sendChat} />
      {settings.showDebugOverlay && (
        <SocketStatusPanel
          connected={connected}
          sentUpdates={sentUpdates}
          receivedUpdates={receivedUpdates}
          logs={socketLogs}
        />
      )}
      <div className="game-status-pill">
        {saveFeedback}
        <span className="game-server-name"> · {bootstrapData.serverDisplayName}</span>
        {settings.showDebugOverlay && (
          <span className="game-server-name">
            {' '}
            · X:{localPosition.x.toFixed(1)} Z:{localPosition.z.toFixed(1)}
          </span>
        )}
        <span className="game-mp-indicator"> · Online: {connected ? onlineCount : '—'}</span>
      </div>
      <div className="game-stats-hud">
        <div className="game-stats-header">
          <span>{bootstrapData.player.username}</span>
          <span>Lv. {level}</span>
        </div>
        <div className="game-stat-row">
          <span>HP</span>
          <div className="game-stat-bar-track">
            <div className="game-stat-bar-fill game-stat-bar-fill--hp" style={{ width: `${Math.max(0, Math.min(100, hp))}%` }} />
          </div>
          <span>{Math.round(hp)}</span>
        </div>
        <div className="game-stat-row">
          <span>Energy</span>
          <div className="game-stat-bar-track">
            <div
              className="game-stat-bar-fill game-stat-bar-fill--energy"
              style={{ width: `${Math.max(0, Math.min(100, energy))}%` }}
            />
          </div>
          <span>{Math.round(energy)}</span>
        </div>
        <div className="game-stat-row">
          <span>EXP</span>
          <div className="game-stat-bar-track">
            <div className="game-stat-bar-fill game-stat-bar-fill--exp" style={{ width: `${expPercent}%` }} />
          </div>
          <span>
            {exp}/250
          </span>
        </div>
      </div>
      <PlayerInspectPanel
        open={inspectUserId !== null}
        profile={inspectProfile}
        loading={inspectLoading}
        onClose={() => {
          setInspectUserId(null);
          setInspectProfile(null);
        }}
      />
      <SettingsModal
        open={settingsOpen}
        settings={settings}
        assets={assets}
        keybindings={keybindings}
        listeningAction={listeningAction}
        conflicts={conflicts}
        onCaptureStart={setListeningAction}
        onSettingsChange={setSettings}
        onAssetsChange={setAssets}
        onReset={() => setKeybindings({ ...DEFAULT_KEYBINDINGS })}
        onApply={() => {
          void savePlayer(token, {
            position: positionRef.current,
            settings,
            keybindings,
            assets
          })
            .then(() => setSaveFeedback('Saved'))
            .catch(() => setSaveFeedback('Save failed'));
        }}
        onClose={() => setSettingsOpen(false)}
        onLogout={() => {
          disconnect();
          onLogout?.();
        }}
      />
    </div>
  );
}

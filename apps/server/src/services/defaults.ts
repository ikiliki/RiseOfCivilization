import type { KeybindingMap, PlayerSettings, Vec3 } from '@roc/shared-types';

export const DEFAULT_KEYBINDINGS: KeybindingMap = {
  moveForward: 'KeyW',
  moveBackward: 'KeyS',
  moveLeft: 'KeyA',
  moveRight: 'KeyD',
  toggleEquipment: 'KeyE',
  toggleItems: 'KeyI',
  toggleSettings: 'Backslash'
};

export const DEFAULT_SETTINGS: PlayerSettings = {
  showDebugOverlay: true,
  masterVolume: 0.8
};

export const DEFAULT_STATS = {
  energy: 100,
  hydration: 100
};

export const ORIGIN_SPAWN: Vec3 = { x: 0, y: 0, z: 0 };

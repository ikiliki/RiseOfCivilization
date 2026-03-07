export type Biome = 'grassland' | 'desert' | 'ice';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface KeybindingMap {
  moveForward: string;
  moveBackward: string;
  moveLeft: string;
  moveRight: string;
  toggleEquipment: string;
  toggleItems: string;
  toggleSettings: string;
}

export interface PlayerSettings {
  showDebugOverlay: boolean;
  masterVolume: number;
}

export interface WorldMetadata {
  id: number;
  worldSeed: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveredChunkRecord {
  chunkX: number;
  chunkY: number;
  biome: Biome;
  spawnable: boolean;
  discovered: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkinInfo {
  id: number;
  name: string;
  colorHex: string;
}

export interface PlayerAssetLoadout {
  hatAssetId: string;
  shoesAssetId: string;
  /**
   * Reserved for future user-imported assets (URL per slot).
   * If provided, client can prioritize URL over built-in asset IDs.
   */
  customAssetUrls?: Partial<Record<'hat' | 'shoes', string>>;
}

export const DEFAULT_PLAYER_ASSET_LOADOUT: PlayerAssetLoadout = {
  hatAssetId: 'cap',
  shoesAssetId: 'sneakers'
};

export interface PlayerState {
  userId: string;
  username: string;
  position: Vec3;
  keybindings: KeybindingMap;
  settings: PlayerSettings;
  currency: number;
  stats: {
    energy: number;
    hydration: number;
  };
  skin?: SkinInfo;
  assets?: PlayerAssetLoadout;
}

export interface LoginRequest {
  username: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  username: string;
  serverDisplayName: string;
}

export interface BootstrapResponse {
  world: WorldMetadata;
  player: PlayerState;
  spawn: Vec3;
  serverDisplayName: string;
}

export interface SavePlayerRequest {
  position: Vec3;
  settings: PlayerSettings;
  keybindings: KeybindingMap;
  assets?: PlayerAssetLoadout;
}

export interface ChunkDiscoverRequest {
  chunkX: number;
  chunkY: number;
  biome: Biome;
  spawnable: boolean;
}

// --- Phase 2: Multiplayer presence ---

export interface PlayerPresence {
  userId: string;
  username: string;
  position: Vec3;
  direction?: { x: number; z: number };
  lastUpdatedAt: number;
  skinColor?: string;
  assets?: PlayerAssetLoadout;
}

export interface PresenceUpdate {
  type: 'presence_update';
  players: PlayerPresence[];
  onlineCount: number;
}

export interface ChatMessage {
  type: 'chat_message';
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface ClientChatMessage {
  type: 'chat_message';
  text: string;
}

export interface PresenceLeave {
  type: 'presence_leave';
  userId: string;
}

export interface RecentPlayer {
  username: string;
  skinColor: string;
}

export interface ClientPositionUpdate {
  type: 'position_update';
  position: Vec3;
  direction?: { x: number; z: number };
}

export interface InspectProfilePayload {
  userId: string;
  username: string;
  position: Vec3;
  currency: number;
  stats: { energy: number; hydration: number };
  chunkX?: number;
  chunkY?: number;
  biome?: Biome;
  skinColor?: string;
  assets?: PlayerAssetLoadout;
}

export interface PresenceServerSummary {
  serverId: string;
  realm: string;
  onlineCount: number;
}

export interface PresenceServersResponse {
  servers: PresenceServerSummary[];
}

export interface PresenceOnlineResponse {
  serverId: string;
  realm: string;
  onlineCount: number;
  players: PlayerPresence[];
}

export interface PresencePlayerResponse {
  player: PlayerPresence;
  serverId: string;
  realm: string;
}

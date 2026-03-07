import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
import type {
  Biome,
  ChunkDiscoverRequest,
  KeybindingMap,
  PlayerAssetLoadout,
  PlayerPresence,
  Vec3
} from '@roc/shared-types';
import { chunkKey, generateChunk, getChunkSize, worldToChunk } from '@roc/world-engine';
import { discoverChunk, loadDiscoveredInRange } from '../api';
import { PlayerAvatar } from './PlayerAvatar';
import './GameScene.styles.css';

/** Ref-based presence store for live position updates. Read in useFrame every frame. */
export type RemotePlayersMapRef = RefObject<Map<string, PlayerPresence>>;

interface GameSceneProps {
  token: string;
  worldSeed: string;
  initialPosition: Vec3;
  keybindings: KeybindingMap;
  onPositionChange: (position: Vec3) => void;
  positionRef?: RefObject<Vec3>;
  directionRef?: RefObject<{ x: number; z: number } | undefined>;
  remotePlayersMapRef?: RemotePlayersMapRef;
  remotePlayerIds?: string[];
  onPlayerSelected?: (userId: string) => void;
  localSkinColor?: string;
  localUsername?: string;
  localAssets?: PlayerAssetLoadout;
}

interface ChunkView {
  chunkX: number;
  chunkY: number;
  biome: Biome;
  spawnable: boolean;
}

const ACTIVE_RADIUS = 2;

const LERP_FACTOR = 8;
const TARGET_SMOOTH = 0.45;
const TELEPORT_THRESHOLD = 25;
const NAME_TAG_HEIGHT = 1.85;
const CAMERA_HEIGHT = 24;
const CAMERA_Z_OFFSET = 14;

function assetLoadoutChanged(a: PlayerAssetLoadout, b: PlayerAssetLoadout): boolean {
  return (
    a.hatAssetId !== b.hatAssetId ||
    a.shoesAssetId !== b.shoesAssetId ||
    a.customAssetUrls?.hat !== b.customAssetUrls?.hat ||
    a.customAssetUrls?.shoes !== b.customAssetUrls?.shoes
  );
}

/**
 * Renders a remote player. Reads position from remotePlayersMapRef every frame
 * in useFrame for live updates, bypassing React's render cycle.
 */
function RemotePlayerMesh({
  userId,
  remotePlayersMapRef,
  onPlayerSelected
}: {
  userId: string;
  remotePlayersMapRef: RemotePlayersMapRef;
  onPlayerSelected?: (userId: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const current = useRef(new THREE.Vector3(0, 0.6, 0));
  const targetRef = useRef(new THREE.Vector3(0, 0.6, 0));
  const incomingRef = useRef(new THREE.Vector3(0, 0.6, 0));
  const lastKnownRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const [skinColor, setSkinColor] = useState('#5b8def');
  const [username, setUsername] = useState('');
  const [assetLoadout, setAssetLoadout] = useState<PlayerAssetLoadout>(DEFAULT_PLAYER_ASSET_LOADOUT);

  useFrame((_, delta) => {
    const presence = remotePlayersMapRef.current?.get(userId);
    if (!presence) return;

    const nextSkinColor = presence.skinColor ?? '#5b8def';
    if (nextSkinColor !== skinColor) setSkinColor(nextSkinColor);
    if (presence.username !== username) setUsername(presence.username ?? '');
    const nextAssets = presence.assets ?? DEFAULT_PLAYER_ASSET_LOADOUT;
    if (assetLoadoutChanged(assetLoadout, nextAssets)) {
      setAssetLoadout(nextAssets);
    }
    const { x, z } = presence.position;

    // Teleport if position jumped (e.g. respawn)
    if (Math.abs(current.current.x - x) > TELEPORT_THRESHOLD || Math.abs(current.current.z - z) > TELEPORT_THRESHOLD) {
      current.current.set(x, 0.6, z);
      targetRef.current.set(x, 0.6, z);
      incomingRef.current.set(x, 0.6, z);
    } else {
      incomingRef.current.set(x, 0.6, z);
      targetRef.current.lerp(incomingRef.current, TARGET_SMOOTH);
      current.current.lerp(targetRef.current, 1 - Math.exp(-LERP_FACTOR * delta));
    }

    lastKnownRef.current = { x, z };
    if (groupRef.current) groupRef.current.position.copy(current.current);
  });

  return (
    <group ref={groupRef} position={[0, 0.6, 0]}>
      <PlayerAvatar
        skinColor={skinColor}
        assets={assetLoadout}
        onClick={(e) => {
          e.stopPropagation();
          onPlayerSelected?.(userId);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      />
      <Html
        center
        transform
        position={[0, NAME_TAG_HEIGHT, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontSize: '12px',
          fontWeight: 600,
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          fontFamily: 'system-ui, sans-serif'
        }}
        occlude
      >
        <span className="game-player-nametag">{username || 'Player'}</span>
      </Html>
    </group>
  );
}

function biomeColor(biome: Biome): string {
  if (biome === 'grassland') return '#4f9d69';
  if (biome === 'desert') return '#d2a257';
  return '#97bbef';
}

function SceneRuntime({
  token,
  worldSeed,
  initialPosition,
  keybindings,
  onPositionChange,
  positionRef,
  directionRef,
  remotePlayersMapRef,
  remotePlayerIds = [],
  onPlayerSelected,
  localSkinColor = '#f8f3ff',
  localUsername = '',
  localAssets = DEFAULT_PLAYER_ASSET_LOADOUT
}: GameSceneProps) {
  const localPlayerGroupRef = useRef<THREE.Group>(null);
  const pressed = useRef<Record<string, boolean>>({});
  const position = useRef(new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const { camera } = useThree();
  const chunkSize = getChunkSize();
  const [currentChunk, setCurrentChunk] = useState(() => worldToChunk(initialPosition.x, initialPosition.z));
  const [chunks, setChunks] = useState<Map<string, ChunkView>>(new Map());
  const inFlightDiscover = useRef<Set<string>>(new Set());

  useEffect(() => {
    const onDown = (event: KeyboardEvent) => {
      pressed.current[event.code] = true;
    };
    const onUp = (event: KeyboardEvent) => {
      pressed.current[event.code] = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useEffect(() => {
    async function syncChunks() {
      const minX = currentChunk.chunkX - ACTIVE_RADIUS;
      const maxX = currentChunk.chunkX + ACTIVE_RADIUS;
      const minY = currentChunk.chunkY - ACTIVE_RADIUS;
      const maxY = currentChunk.chunkY + ACTIVE_RADIUS;
      const discovered = await loadDiscoveredInRange(token, minX, maxX, minY, maxY);
      const nextMap = new Map<string, ChunkView>();
      discovered.forEach((chunk) => {
        nextMap.set(chunkKey(chunk.chunkX, chunk.chunkY), {
          chunkX: chunk.chunkX,
          chunkY: chunk.chunkY,
          biome: chunk.biome,
          spawnable: chunk.spawnable
        });
      });

      const discoverWrites: Promise<void>[] = [];
      for (let x = minX; x <= maxX; x += 1) {
        for (let y = minY; y <= maxY; y += 1) {
          const key = chunkKey(x, y);
          if (!nextMap.has(key)) {
            const generated = generateChunk(worldSeed, x, y);
            nextMap.set(key, {
              chunkX: x,
              chunkY: y,
              biome: generated.biome,
              spawnable: generated.spawnable
            });
            if (!inFlightDiscover.current.has(key)) {
              inFlightDiscover.current.add(key);
              discoverWrites.push(
                discoverChunk(token, {
                  chunkX: x,
                  chunkY: y,
                  biome: generated.biome,
                  spawnable: generated.spawnable
                } satisfies ChunkDiscoverRequest)
                  .catch(() => undefined)
                  .finally(() => {
                    inFlightDiscover.current.delete(key);
                  })
              );
            }
          }
        }
      }
      setChunks(nextMap);
      await Promise.all(discoverWrites);
    }

    void syncChunks();
  }, [currentChunk.chunkX, currentChunk.chunkY, token, worldSeed]);

  const lastDirection = useRef<{ x: number; z: number }>({ x: 0, z: 0 });

  useFrame((_, delta) => {
    const moveSpeed = 10;
    let dx = 0;
    let dz = 0;
    if (pressed.current[keybindings.moveForward]) dz -= 1;
    if (pressed.current[keybindings.moveBackward]) dz += 1;
    if (pressed.current[keybindings.moveLeft]) dx -= 1;
    if (pressed.current[keybindings.moveRight]) dx += 1;

    if (dx !== 0 || dz !== 0) {
      const length = Math.hypot(dx, dz);
      dx /= length;
      dz /= length;
      position.current.x += dx * moveSpeed * delta;
      position.current.z += dz * moveSpeed * delta;
      lastDirection.current = { x: dx, z: dz };
    }

    if (localPlayerGroupRef.current) {
      localPlayerGroupRef.current.position.set(position.current.x, 0.6, position.current.z);
    }

    const vec = { x: position.current.x, y: 0, z: position.current.z };
    if (positionRef?.current) {
      positionRef.current.x = vec.x;
      positionRef.current.y = vec.y;
      positionRef.current.z = vec.z;
    }
    if (directionRef) {
      directionRef.current = lastDirection.current;
    }
    camera.position.set(position.current.x, CAMERA_HEIGHT, position.current.z + CAMERA_Z_OFFSET);
    camera.lookAt(position.current.x, 0.6, position.current.z);
    onPositionChange(vec);

    const playerChunk = worldToChunk(position.current.x, position.current.z);
    if (playerChunk.chunkX !== currentChunk.chunkX || playerChunk.chunkY !== currentChunk.chunkY) {
      setCurrentChunk(playerChunk);
    }
  });

  const renderedChunks = useMemo(() => [...chunks.values()], [chunks]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 12]} intensity={1.1} />
      {renderedChunks.map((chunk) => (
        <mesh
          key={`${chunk.chunkX}:${chunk.chunkY}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[chunk.chunkX * chunkSize + chunkSize / 2, -0.01, chunk.chunkY * chunkSize + chunkSize / 2]}
        >
          <planeGeometry args={[chunkSize, chunkSize]} />
          <meshStandardMaterial color={biomeColor(chunk.biome)} />
        </mesh>
      ))}
      <group ref={localPlayerGroupRef} position={[initialPosition.x, 0.6, initialPosition.z]}>
        <PlayerAvatar skinColor={localSkinColor} assets={localAssets} />
        <Html
          center
          transform
          position={[0, NAME_TAG_HEIGHT, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            fontWeight: 600,
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            fontFamily: 'system-ui, sans-serif'
          }}
          occlude
        >
          <span className="game-player-nametag">{localUsername || 'You'}</span>
        </Html>
      </group>
      {remotePlayersMapRef &&
        remotePlayerIds.map((userId) => (
          <RemotePlayerMesh
            key={userId}
            userId={userId}
            remotePlayersMapRef={remotePlayersMapRef}
            onPlayerSelected={onPlayerSelected}
          />
        ))}
      <gridHelper args={[200, 40, '#3a4f73', '#202f49']} />
    </>
  );
}

export function GameScene(props: GameSceneProps) {
  return (
    <div className="game-scene-root">
      <Canvas>
        <SceneRuntime {...props} />
      </Canvas>
    </div>
  );
}

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
import { chunkKey, generateChunk, getChunkSize, worldToChunk } from '@roc/world-engine';
import { discoverChunk, loadDiscoveredInRange } from '../api';
import { PlayerAvatar } from './PlayerAvatar';
import './GameScene.styles.css';
const ACTIVE_RADIUS = 2;
const LERP_FACTOR = 8;
const TARGET_SMOOTH = 0.45;
const TELEPORT_THRESHOLD = 25;
const NAME_TAG_HEIGHT = 1.85;
const CAMERA_HEIGHT = 24;
const CAMERA_Z_OFFSET = 14;
function assetLoadoutChanged(a, b) {
    return (a.hatAssetId !== b.hatAssetId ||
        a.shoesAssetId !== b.shoesAssetId ||
        a.customAssetUrls?.hat !== b.customAssetUrls?.hat ||
        a.customAssetUrls?.shoes !== b.customAssetUrls?.shoes);
}
/**
 * Renders a remote player. Reads position from remotePlayersMapRef every frame
 * in useFrame for live updates, bypassing React's render cycle.
 */
function RemotePlayerMesh({ userId, remotePlayersMapRef, onPlayerSelected }) {
    const groupRef = useRef(null);
    const current = useRef(new THREE.Vector3(0, 0.6, 0));
    const targetRef = useRef(new THREE.Vector3(0, 0.6, 0));
    const incomingRef = useRef(new THREE.Vector3(0, 0.6, 0));
    const lastKnownRef = useRef({ x: 0, z: 0 });
    const [skinColor, setSkinColor] = useState('#5b8def');
    const [username, setUsername] = useState('');
    const [assetLoadout, setAssetLoadout] = useState(DEFAULT_PLAYER_ASSET_LOADOUT);
    useFrame((_, delta) => {
        const presence = remotePlayersMapRef.current?.get(userId);
        if (!presence)
            return;
        const nextSkinColor = presence.skinColor ?? '#5b8def';
        if (nextSkinColor !== skinColor)
            setSkinColor(nextSkinColor);
        if (presence.username !== username)
            setUsername(presence.username ?? '');
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
        }
        else {
            incomingRef.current.set(x, 0.6, z);
            targetRef.current.lerp(incomingRef.current, TARGET_SMOOTH);
            current.current.lerp(targetRef.current, 1 - Math.exp(-LERP_FACTOR * delta));
        }
        lastKnownRef.current = { x, z };
        if (groupRef.current)
            groupRef.current.position.copy(current.current);
    });
    return (_jsxs("group", { ref: groupRef, position: [0, 0.6, 0], children: [_jsx(PlayerAvatar, { skinColor: skinColor, assets: assetLoadout, onClick: (e) => {
                    e.stopPropagation();
                    onPlayerSelected?.(userId);
                }, onPointerOver: (e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                }, onPointerOut: () => {
                    document.body.style.cursor = 'default';
                } }), _jsx(Html, { center: true, transform: true, position: [0, NAME_TAG_HEIGHT, 0], style: {
                    pointerEvents: 'none',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    fontFamily: 'system-ui, sans-serif'
                }, occlude: true, children: _jsx("span", { className: "game-player-nametag", children: username || 'Player' }) })] }));
}
function biomeColor(biome) {
    if (biome === 'grassland')
        return '#4f9d69';
    if (biome === 'desert')
        return '#d2a257';
    return '#97bbef';
}
function SceneRuntime({ token, worldSeed, initialPosition, keybindings, onPositionChange, positionRef, directionRef, remotePlayersMapRef, remotePlayerIds = [], onPlayerSelected, localSkinColor = '#f8f3ff', localUsername = '', localAssets = DEFAULT_PLAYER_ASSET_LOADOUT }) {
    const localPlayerGroupRef = useRef(null);
    const pressed = useRef({});
    const position = useRef(new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
    const { camera } = useThree();
    const chunkSize = getChunkSize();
    const [currentChunk, setCurrentChunk] = useState(() => worldToChunk(initialPosition.x, initialPosition.z));
    const [chunks, setChunks] = useState(new Map());
    const inFlightDiscover = useRef(new Set());
    useEffect(() => {
        const onDown = (event) => {
            pressed.current[event.code] = true;
        };
        const onUp = (event) => {
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
            const nextMap = new Map();
            discovered.forEach((chunk) => {
                nextMap.set(chunkKey(chunk.chunkX, chunk.chunkY), {
                    chunkX: chunk.chunkX,
                    chunkY: chunk.chunkY,
                    biome: chunk.biome,
                    spawnable: chunk.spawnable
                });
            });
            const discoverWrites = [];
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
                            discoverWrites.push(discoverChunk(token, {
                                chunkX: x,
                                chunkY: y,
                                biome: generated.biome,
                                spawnable: generated.spawnable
                            })
                                .catch(() => undefined)
                                .finally(() => {
                                inFlightDiscover.current.delete(key);
                            }));
                        }
                    }
                }
            }
            setChunks(nextMap);
            await Promise.all(discoverWrites);
        }
        void syncChunks();
    }, [currentChunk.chunkX, currentChunk.chunkY, token, worldSeed]);
    const lastDirection = useRef({ x: 0, z: 0 });
    useFrame((_, delta) => {
        const moveSpeed = 10;
        let dx = 0;
        let dz = 0;
        if (pressed.current[keybindings.moveForward])
            dz -= 1;
        if (pressed.current[keybindings.moveBackward])
            dz += 1;
        if (pressed.current[keybindings.moveLeft])
            dx -= 1;
        if (pressed.current[keybindings.moveRight])
            dx += 1;
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
    return (_jsxs(_Fragment, { children: [_jsx("ambientLight", { intensity: 0.7 }), _jsx("directionalLight", { position: [10, 20, 12], intensity: 1.1 }), renderedChunks.map((chunk) => (_jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [chunk.chunkX * chunkSize + chunkSize / 2, -0.01, chunk.chunkY * chunkSize + chunkSize / 2], children: [_jsx("planeGeometry", { args: [chunkSize, chunkSize] }), _jsx("meshStandardMaterial", { color: biomeColor(chunk.biome) })] }, `${chunk.chunkX}:${chunk.chunkY}`))), _jsxs("group", { ref: localPlayerGroupRef, position: [initialPosition.x, 0.6, initialPosition.z], children: [_jsx(PlayerAvatar, { skinColor: localSkinColor, assets: localAssets }), _jsx(Html, { center: true, transform: true, position: [0, NAME_TAG_HEIGHT, 0], style: {
                            pointerEvents: 'none',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#fff',
                            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                            fontFamily: 'system-ui, sans-serif'
                        }, occlude: true, children: _jsx("span", { className: "game-player-nametag", children: localUsername || 'You' }) })] }), remotePlayersMapRef &&
                remotePlayerIds.map((userId) => (_jsx(RemotePlayerMesh, { userId: userId, remotePlayersMapRef: remotePlayersMapRef, onPlayerSelected: onPlayerSelected }, userId))), _jsx("gridHelper", { args: [200, 40, '#3a4f73', '#202f49'] })] }));
}
export function GameScene(props) {
    return (_jsx("div", { className: "game-scene-root", children: _jsx(Canvas, { children: _jsx(SceneRuntime, { ...props }) }) }));
}

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { PlayerAvatar } from './PlayerAvatar';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
const meta = {
    title: 'Game/PlayerAvatar',
    component: PlayerAvatar,
    parameters: { layout: 'fullscreen' }
};
export default meta;
/** Fixed camera matching game view: top-down from [0, 24, 14] looking at player. */
function GameCamera() {
    const { camera } = useThree();
    useEffect(() => {
        camera.position.set(0, 24, 14);
        camera.lookAt(0, 0.6, 0);
    }, [camera]);
    return null;
}
/**
 * Matches GameScene: same lighting, ground, fixed top-down camera (no orbit).
 * Avatar scaled 1.25x for better visibility.
 */
function Scene({ skinColor, assets }) {
    return (_jsxs(_Fragment, { children: [_jsx(GameCamera, {}), _jsx("ambientLight", { intensity: 0.7 }), _jsx("directionalLight", { position: [10, 20, 12], intensity: 1.1 }), _jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0, -0.6, 0], children: [_jsx("planeGeometry", { args: [8, 8] }), _jsx("meshStandardMaterial", { color: "#4f9d69" })] }), _jsx("group", { position: [0, 0.6, 0], children: _jsx(PlayerAvatar, { skinColor: skinColor, assets: assets }) }), _jsx("gridHelper", { args: [200, 40, '#3a4f73', '#202f49'] })] }));
}
export const Default = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#f8f3ff", assets: DEFAULT_PLAYER_ASSET_LOADOUT }) }))
};
export const NoAccessories = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#f8f3ff", assets: { hatAssetId: '', shoesAssetId: '' } }) }))
};
export const CapOnly = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#f8f3ff", assets: { hatAssetId: 'cap', shoesAssetId: '' } }) }))
};
export const CrownOnly = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#f8f3ff", assets: { hatAssetId: 'crown', shoesAssetId: '' } }) }))
};
export const SneakersOnly = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#f8f3ff", assets: { hatAssetId: '', shoesAssetId: 'sneakers' } }) }))
};
export const BootsOnly = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#f8f3ff", assets: { hatAssetId: '', shoesAssetId: 'boots' } }) }))
};
export const FullLoadout = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#f8f3ff", assets: { hatAssetId: 'crown', shoesAssetId: 'boots' } }) }))
};
export const SkinColorLight = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#f8f3ff", assets: DEFAULT_PLAYER_ASSET_LOADOUT }) }))
};
export const SkinColorTan = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#e8c9a8", assets: DEFAULT_PLAYER_ASSET_LOADOUT }) }))
};
export const SkinColorBrown = {
    render: () => (_jsx(Canvas, { camera: { position: [0, 24, 14], fov: 50 }, children: _jsx(Scene, { skinColor: "#8b5a2b", assets: DEFAULT_PLAYER_ASSET_LOADOUT }) }))
};

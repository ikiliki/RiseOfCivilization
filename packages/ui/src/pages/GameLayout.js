import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
import { HudShell } from './HudShell';
import { PlayerInspectPanel } from '../features/components/PlayerInspectPanel';
import { SettingsModal } from '../features/components/SettingsModal';
import './GameLayout.styles.css';
const DEFAULT_KEYBINDINGS = {
    moveForward: 'KeyW',
    moveBackward: 'KeyS',
    moveLeft: 'KeyA',
    moveRight: 'KeyD',
    toggleEquipment: 'KeyE',
    toggleItems: 'KeyI',
    toggleSettings: 'Backslash'
};
export function GameLayout({ children, username, skinColor, currency = 120, energy = 100, hydration = 80, saveFeedback = 'Connected', connected = true, inspectOpen = false, inspectProfile = null, inspectLoading = false, settingsOpen = false, settings = { showDebugOverlay: false, masterVolume: 0.8 }, assets = DEFAULT_PLAYER_ASSET_LOADOUT, keybindings = DEFAULT_KEYBINDINGS, onOpenSettings = () => { }, onCloseInspect = () => { }, onCloseSettings = () => { }, onLogout }) {
    const [listeningAction, setListeningAction] = React.useState(null);
    const [localKeybindings, setLocalKeybindings] = React.useState(keybindings);
    const [localSettings, setLocalSettings] = React.useState(settings);
    const [localAssets, setLocalAssets] = React.useState(assets);
    React.useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);
    React.useEffect(() => {
        setLocalAssets(assets);
    }, [assets]);
    const conflicts = React.useMemo(() => {
        const used = new Map();
        const duplicates = [];
        Object.keys(localKeybindings).forEach((action) => {
            const key = localKeybindings[action];
            if (used.has(key))
                duplicates.push(action);
            else
                used.set(key, action);
        });
        return duplicates;
    }, [localKeybindings]);
    React.useEffect(() => {
        if (!listeningAction)
            return;
        const onKeyDown = (event) => {
            event.preventDefault();
            setLocalKeybindings((prev) => ({ ...prev, [listeningAction]: event.code }));
            setListeningAction(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [listeningAction]);
    return (_jsxs("div", { className: "roc-game-layout", children: [_jsx("div", { className: "roc-game-layout-map", children: children }), _jsx(HudShell, { username: username, skinColor: skinColor, currency: currency, energy: energy, hydration: hydration, onOpenSettings: onOpenSettings }), _jsxs("div", { className: "roc-game-layout-status", children: [saveFeedback, connected && _jsx("span", { className: "roc-game-layout-status-online", children: " \u00B7 Online" })] }), _jsx(PlayerInspectPanel, { open: inspectOpen, profile: inspectProfile, loading: inspectLoading, onClose: onCloseInspect }), _jsx(SettingsModal, { open: settingsOpen, settings: localSettings, assets: localAssets, keybindings: localKeybindings, listeningAction: listeningAction, conflicts: conflicts, onSettingsChange: setLocalSettings, onAssetsChange: setLocalAssets, onCaptureStart: setListeningAction, onReset: () => setLocalKeybindings(DEFAULT_KEYBINDINGS), onApply: () => {
                    onCloseSettings();
                }, onClose: onCloseSettings, onLogout: onLogout })] }));
}

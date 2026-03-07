import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './SettingsModal.styles.css';
import { Button } from '../../components/Button';
import { KeybindingRow } from './KeybindingRow';
import { DEFAULT_PLAYER_ASSET_LOADOUT } from '@roc/shared-types';
export function SettingsModal({ open, keybindings, settings, assets, listeningAction, conflicts, onSettingsChange, onAssetsChange, onCaptureStart, onReset, onApply, onClose, onLogout }) {
    if (!open)
        return null;
    const normalizedAssets = assets ?? DEFAULT_PLAYER_ASSET_LOADOUT;
    return (_jsx("div", { className: "roc-settings-backdrop", children: _jsxs("div", { className: "roc-settings-modal", children: [_jsx("h2", { children: "Settings" }), _jsxs("p", { children: ["Master volume: ", Math.round(settings.masterVolume * 100), "%"] }), _jsxs("label", { className: "roc-settings-toggle", children: [_jsx("input", { type: "checkbox", checked: settings.showDebugOverlay, onChange: (event) => onSettingsChange({
                                ...settings,
                                showDebugOverlay: event.target.checked
                            }) }), _jsx("span", { children: "Developer mode (debug overlay)" })] }), _jsxs("div", { className: "roc-settings-assets", children: [_jsx("h3", { children: "Player Assets" }), _jsx("p", { className: "roc-settings-assets-note", children: "Choose built-in cosmetics now. Custom imports can be added later." }), _jsxs("label", { className: "roc-settings-field", children: [_jsx("span", { children: "Hat" }), _jsxs("select", { value: normalizedAssets.hatAssetId, onChange: (event) => onAssetsChange({
                                        ...normalizedAssets,
                                        hatAssetId: event.target.value
                                    }), children: [_jsx("option", { value: "none", children: "None" }), _jsx("option", { value: "cap", children: "Cap" }), _jsx("option", { value: "crown", children: "Crown" })] })] }), _jsxs("label", { className: "roc-settings-field", children: [_jsx("span", { children: "Shoes" }), _jsxs("select", { value: normalizedAssets.shoesAssetId, onChange: (event) => onAssetsChange({
                                        ...normalizedAssets,
                                        shoesAssetId: event.target.value
                                    }), children: [_jsx("option", { value: "none", children: "None" }), _jsx("option", { value: "sneakers", children: "Sneakers" }), _jsx("option", { value: "boots", children: "Boots" })] })] })] }), _jsx("div", { children: Object.entries(keybindings).map(([action, keyValue]) => (_jsx(KeybindingRow, { action: action, keyValue: keyValue, listening: listeningAction === action, conflict: conflicts.includes(action), onStartCapture: () => onCaptureStart(action) }, action))) }), _jsxs("div", { className: "roc-settings-actions", children: [_jsx(Button, { onClick: onReset, children: "Reset Defaults" }), _jsx(Button, { onClick: onApply, children: "Apply" }), onLogout && (_jsx(Button, { onClick: onLogout, className: "roc-settings-logout", children: "Log out" })), _jsx(Button, { onClick: onClose, children: "Close" })] })] }) }));
}

import { jsx as _jsx } from "react/jsx-runtime";
import './MockMap.styles.css';
/**
 * Placeholder for the 3D game map in Storybook.
 * Simulates terrain with a gradient background.
 */
export function MockMap({ label = 'Map' }) {
    return _jsx("div", { className: "roc-mock-map", children: label });
}

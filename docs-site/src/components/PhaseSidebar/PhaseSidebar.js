import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './PhaseSidebar.styles.module.css';
export function PhaseSidebar({ features, selectedFeatureId, onFeatureSelect, currentFeatureLabel = '', }) {
    const normalizedCurrent = currentFeatureLabel.toLowerCase();
    function isCurrentFeature(feature) {
        return (feature.status === 'in_progress' ||
            feature.title.toLowerCase().includes(normalizedCurrent) ||
            normalizedCurrent.includes(feature.title.toLowerCase()) ||
            normalizedCurrent.includes(feature.id));
    }
    return (_jsxs("aside", { className: styles.sidebar, "aria-label": "Feature filter", children: [_jsx("h3", { className: styles.heading, children: "Features" }), _jsxs("nav", { className: styles.nav, children: [_jsx("button", { type: "button", className: `${styles.option} ${selectedFeatureId === 'all' ? styles.selected : ''}`, onClick: () => onFeatureSelect('all'), children: "All" }), features.length === 0 ? (_jsx("p", { className: styles.empty, children: "No features" })) : (features.map((feature) => {
                        const isCurrent = isCurrentFeature(feature);
                        return (_jsxs("button", { type: "button", className: `${styles.option} ${selectedFeatureId === feature.id ? styles.selected : ''} ${isCurrent ? styles.current : ''}`, onClick: () => onFeatureSelect(feature.id), children: [_jsx("span", { className: styles.phaseTitle, children: feature.title }), _jsx("span", { className: `${styles.statusPill} ${styles[feature.status]}`, children: feature.status === 'planned' ? 'planned' : feature.status === 'in_progress' ? 'in progress' : 'done' })] }, feature.id));
                    }))] })] }));
}

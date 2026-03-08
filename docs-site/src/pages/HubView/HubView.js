import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { FeatureSidebar } from '../../components/FeatureSidebar/FeatureSidebar';
import { FeaturesByStatus } from '../../components/FeaturesByStatus/FeaturesByStatus';
import { normalizeWorkItems } from '../../lib/dashboard';
import styles from './HubView.styles.module.css';
/** Sort feature IDs so 1 < 1.1 < 1.2 < 1.3 (ascending by feature number). */
function sortFeaturesByNumber(features) {
    const parseId = (id) => id.split('.').map(Number);
    const compare = (a, b) => {
        const pa = parseId(a.id);
        const pb = parseId(b.id);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const va = pa[i] ?? 0;
            const vb = pb[i] ?? 0;
            if (va !== vb)
                return va - vb;
        }
        return 0;
    };
    return [...features].sort(compare);
}
export function HubView({ content }) {
    const [selectedFeatureId, setSelectedFeatureId] = useState('all');
    const rawFeatures = content.plan?.features ?? [];
    const features = useMemo(() => sortFeaturesByNumber(rawFeatures), [rawFeatures]);
    const workItems = content.plan?.workItems ?? normalizeWorkItems(content.planStatus);
    const currentFeatureLabel = content.planStatus?.feature ??
        content.planStatus?.phase ??
        content.overview?.currentFeature ??
        content.overview?.currentPhase ??
        '';
    return (_jsx("div", { className: styles.hub, children: _jsxs("div", { className: styles.layout, children: [_jsx(FeatureSidebar, { features: features, selectedFeatureId: selectedFeatureId, onFeatureSelect: setSelectedFeatureId, currentFeatureLabel: currentFeatureLabel }), _jsx(FeaturesByStatus, { items: workItems, selectedFeatureId: selectedFeatureId, features: features })] }) }));
}

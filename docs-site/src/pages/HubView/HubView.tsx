import { useMemo, useState } from 'react';
import type { DocsPortalContent } from '../../types/content';
import type { FeatureSummary } from '../../types/content';
import { FeatureSidebar } from '../../components/FeatureSidebar/FeatureSidebar';
import { FeaturesByStatus } from '../../components/FeaturesByStatus/FeaturesByStatus';
import { normalizeWorkItems } from '../../lib/dashboard';
import styles from './HubView.styles.module.css';

/** Sort feature IDs so 1 < 1.1 < 1.2 < 1.3 (ascending by feature number). */
function sortFeaturesByNumber(features: FeatureSummary[]): FeatureSummary[] {
  const parseId = (id: string) => id.split('.').map(Number);
  const compare = (a: FeatureSummary, b: FeatureSummary) => {
    const pa = parseId(a.id);
    const pb = parseId(b.id);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const va = pa[i] ?? 0;
      const vb = pb[i] ?? 0;
      if (va !== vb) return va - vb;
    }
    return 0;
  };
  return [...features].sort(compare);
}

interface HubViewProps {
  content: DocsPortalContent;
}

export function HubView({ content }: HubViewProps) {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | 'all'>('all');

  const rawFeatures = content.plan?.features ?? [];
  const features = useMemo(() => sortFeaturesByNumber(rawFeatures), [rawFeatures]);
  const workItems =
    content.plan?.workItems ?? normalizeWorkItems(content.planStatus);
  const currentFeatureLabel =
    (content.planStatus as { feature?: string })?.feature ??
    (content.planStatus as { phase?: string })?.phase ??
    (content.overview as { currentFeature?: string })?.currentFeature ??
    (content.overview as { currentPhase?: string })?.currentPhase ??
    '';

  return (
    <div className={styles.hub}>
      <div className={styles.layout}>
        <FeatureSidebar
          features={features}
          selectedFeatureId={selectedFeatureId}
          onFeatureSelect={setSelectedFeatureId}
          currentFeatureLabel={currentFeatureLabel}
        />
        <FeaturesByStatus
          items={workItems}
          selectedFeatureId={selectedFeatureId}
          features={features}
        />
      </div>
    </div>
  );
}

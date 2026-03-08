import type { FeatureSummary } from '../../types/content';
import styles from './PhaseSidebar.styles.module.css';

interface PhaseSidebarProps {
  features: FeatureSummary[];
  selectedFeatureId: string | 'all';
  onFeatureSelect: (id: string | 'all') => void;
  currentFeatureLabel?: string;
}

export function PhaseSidebar({
  features,
  selectedFeatureId,
  onFeatureSelect,
  currentFeatureLabel = '',
}: PhaseSidebarProps) {
  const normalizedCurrent = currentFeatureLabel.toLowerCase();

  function isCurrentFeature(feature: FeatureSummary): boolean {
    return (
      feature.status === 'in_progress' ||
      feature.title.toLowerCase().includes(normalizedCurrent) ||
      normalizedCurrent.includes(feature.title.toLowerCase()) ||
      normalizedCurrent.includes(feature.id)
    );
  }

  return (
    <aside className={styles.sidebar} aria-label="Feature filter">
      <h3 className={styles.heading}>Features</h3>
      <nav className={styles.nav}>
        <button
          type="button"
          className={`${styles.option} ${selectedFeatureId === 'all' ? styles.selected : ''}`}
          onClick={() => onFeatureSelect('all')}
        >
          All
        </button>
        {features.length === 0 ? (
          <p className={styles.empty}>No features</p>
        ) : (
          features.map((feature) => {
            const isCurrent = isCurrentFeature(feature);
            return (
              <button
                key={feature.id}
                type="button"
                className={`${styles.option} ${selectedFeatureId === feature.id ? styles.selected : ''} ${isCurrent ? styles.current : ''}`}
                onClick={() => onFeatureSelect(feature.id)}
              >
                <span className={styles.phaseTitle}>{feature.title}</span>
                <span className={`${styles.statusPill} ${styles[feature.status]}`}>
                  {feature.status === 'planned' ? 'planned' : feature.status === 'in_progress' ? 'in progress' : 'done'}
                </span>
              </button>
            );
          })
        )}
      </nav>
    </aside>
  );
}

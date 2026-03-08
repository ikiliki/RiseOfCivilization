import type { FeatureSummary, WorkItem } from '../../types/content';
import { WorkItemCard } from '../WorkItemCard/WorkItemCard';
import styles from './FeaturesByStatus.styles.module.css';

interface FeaturesByStatusProps {
  items: WorkItem[];
  selectedFeatureId: string | 'all';
  features: FeatureSummary[];
}

const COLUMNS: Array<{ key: 'new' | 'in_progress' | 'done'; label: string; sublabel: string }> = [
  { key: 'new', label: 'Ahead', sublabel: '(Next)' },
  { key: 'in_progress', label: 'In Progress', sublabel: '(Current)' },
  { key: 'done', label: 'Done', sublabel: '(Completed)' },
];

function filterByFeature(
  items: WorkItem[],
  selectedFeatureId: string | 'all',
  features: FeatureSummary[]
): WorkItem[] {
  if (selectedFeatureId === 'all') return items;
  const feature = features.find((f) => f.id === selectedFeatureId);
  if (!feature) return items;
  const getFeature = (item: WorkItem) => (item as { feature?: string }).feature ?? (item as { phase?: string }).phase ?? '';
  return items.filter((item) => getFeature(item) === feature.id);
}

export function FeaturesByStatus({ items, selectedFeatureId, features }: FeaturesByStatusProps) {
  const filtered = filterByFeature(items, selectedFeatureId, features);

  return (
    <div className={styles.container}>
      <h2 className={styles.mainHeading}>Features by Status</h2>
      {filtered.length === 0 ? (
        <div className={styles.emptyAll}>
          <p>
            {selectedFeatureId === 'all'
              ? 'No work items. Run `pnpm docs:sync` and ensure PLAN.md has Completed, In Progress, and Next sections.'
              : 'No work items in this feature.'}
          </p>
        </div>
      ) : (
        <div className={styles.columns}>
          {COLUMNS.map((col) => {
            const columnItems = filtered.filter((item) => item.status === col.key);
            return (
              <section key={col.key} className={styles.column} aria-labelledby={`col-${col.key}`}>
                <div className={styles.columnHeader}>
                  <h3 id={`col-${col.key}`} className={styles.columnTitle}>
                    {col.label}
                  </h3>
                  <span className={styles.sublabel}>{col.sublabel}</span>
                  <span className={styles.count}>{columnItems.length}</span>
                </div>
                <div className={styles.cardList}>
                  {columnItems.length > 0 ? (
                    columnItems.map((item) => <WorkItemCard key={item.id} item={item} />)
                  ) : (
                    <div className={styles.emptyState}>No items</div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

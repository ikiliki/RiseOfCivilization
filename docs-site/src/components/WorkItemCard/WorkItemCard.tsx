import { useState } from 'react';
import type { WorkItem } from '../../types/content';
import styles from './WorkItemCard.styles.module.css';

const VISIBLE_SUB_TASKS = 4;

interface WorkItemCardProps {
  item: WorkItem;
}

export function WorkItemCard({ item }: WorkItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasSubTasks = item.subTasks.length > 0;
  const visibleSubTasks = expanded ? item.subTasks : item.subTasks.slice(0, VISIBLE_SUB_TASKS);
  const hiddenCount = Math.max(0, item.subTasks.length - VISIBLE_SUB_TASKS);

  return (
    <article className={`${styles.card} ${styles[item.status]}`}>
      <div className={styles.cardHeader}>
        <strong className={styles.title}>{item.title}</strong>
        <span className={`${styles.statusBadge} ${styles[item.status]}`}>
          {item.status === 'new' ? 'Ahead' : item.status === 'in_progress' ? 'In Progress' : 'Done'}
        </span>
      </div>
      <div className={styles.meta}>
        <span className={styles.featureBadge}>{(item as { feature?: string }).feature ?? (item as { phase?: string }).phase}</span>
      </div>
      {hasSubTasks && (
        <div className={styles.subTasksSection}>
          <ul className={styles.subTasks}>
            {visibleSubTasks.map((subTask) => (
              <li key={subTask}>{subTask}</li>
            ))}
          </ul>
          {!expanded && hiddenCount > 0 && (
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setExpanded(true)}
              aria-expanded={false}
            >
              …and {hiddenCount} more
            </button>
          )}
          {expanded && hiddenCount > 0 && (
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setExpanded(false)}
              aria-expanded
            >
              Collapse
            </button>
          )}
        </div>
      )}
    </article>
  );
}

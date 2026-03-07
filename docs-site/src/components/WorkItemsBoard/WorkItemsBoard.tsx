import type { WorkItem, WorkItemStatus } from '../../lib/dashboard';
import styles from './WorkItemsBoard.styles.module.css';

interface WorkItemsBoardProps {
  items: WorkItem[];
  pbiTitle: string;
}

const columns: Array<{ label: string; status: WorkItemStatus }> = [
  { label: 'New', status: 'new' },
  { label: 'In Progress', status: 'in_progress' },
  { label: 'Done', status: 'done' }
];

export function WorkItemsBoard({ items, pbiTitle }: WorkItemsBoardProps) {
  return (
    <div className={styles.board}>
      <article className={styles.pbiCard}>
        <span className={styles.eyebrow}>Current PBI</span>
        <h3>{pbiTitle}</h3>
        <p>Phase execution is treated as the top-level work item. Tasks below are grouped by status.</p>
      </article>

      <div className={styles.columns}>
        {columns.map((column) => {
          const columnItems = items.filter((item) => item.status === column.status);

          return (
            <section key={column.status} className={styles.column}>
              <div className={styles.columnHeader}>
                <h3>{column.label}</h3>
                <span className={styles.columnCount}>{columnItems.length}</span>
              </div>

              <div className={styles.cardList}>
                {columnItems.length ? (
                  columnItems.map((item) => (
                    <article key={item.id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <strong>{item.title}</strong>
                        <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className={styles.meta}>
                        <span className={styles.phaseBadge}>{item.phase}</span>
                        {item.subTasks.length ? (
                          <span className={styles.subTaskCount}>{item.subTasks.length} tasks</span>
                        ) : null}
                      </div>

                      {item.subTasks.length ? (
                        <ul className={styles.subTasks}>
                          {item.subTasks.map((subTask) => (
                            <li key={subTask}>{subTask}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.noSubTasks}>No child tasks.</p>
                      )}
                    </article>
                  ))
                ) : (
                  <div className={styles.emptyState}>No items match this column.</div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

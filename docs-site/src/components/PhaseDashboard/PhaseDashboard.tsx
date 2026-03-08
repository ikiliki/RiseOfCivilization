import type { PhaseSummary } from '../../lib/dashboard';
import styles from './PhaseDashboard.styles.module.css';

interface PhaseDashboardProps {
  phases: PhaseSummary[];
}

export function PhaseDashboard({ phases }: PhaseDashboardProps) {
  if (!phases.length) {
    return <p>No roadmap features available.</p>;
  }

  return (
    <div className={styles.grid}>
      {phases.map((phase) => (
        <article key={phase.id} className={styles.card}>
          <div className={styles.header}>
            <span className={styles.title}>{phase.title}</span>
            <span className={`${styles.badge} ${styles[phase.status]}`}>{phase.status}</span>
          </div>

          <p className={styles.summary}>{phase.summary}</p>

          <ul className={styles.list}>
            {phase.bullets.slice(0, 3).map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

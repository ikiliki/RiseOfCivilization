import type { DocsPortalContent } from '../../types/content';
import styles from './HomeView.styles.module.css';

interface HomeViewProps {
  content: DocsPortalContent;
}

export function HomeView({ content }: HomeViewProps) {
  const overview = content.overview ?? {
    projectSummary: content.docs?.docsReadme
      ? (content.docs.docsReadme.match(/## Project Summary\s*([\s\S]*?)(?=##\s+|$)/m)?.[1]?.trim() ?? 'Internal docs portal.')
      : 'Internal docs portal for Rise Of Civilization.',
    currentPhase: content.planStatus?.phase ?? 'Unknown',
    lastUpdated: new Date().toISOString().slice(0, 10)
  };

  return (
    <section className={styles.overview} aria-labelledby="overview-heading">
      <h2 id="overview-heading">Overview</h2>

      <div className={styles.cards}>
        <article className={styles.card}>
          <h3>Project</h3>
          <p>Rise Of Civilization</p>
        </article>
        <article className={styles.card}>
          <h3>Current Phase</h3>
          <div className={styles.phase}>{overview.currentPhase}</div>
        </article>
        <article className={styles.card}>
          <h3>Last Updated</h3>
          <p>{overview.lastUpdated}</p>
        </article>
      </div>

      <div className={styles.summary}>
        <h3>Project Summary</h3>
        <p>{overview.projectSummary}</p>
      </div>

      <div className={styles.meta}>
        <span className="badge">Internal</span>
        <span className="badge">Agents &amp; Developers</span>
        <span className="badge">Synced from docs/ + PLAN.md</span>
      </div>
    </section>
  );
}

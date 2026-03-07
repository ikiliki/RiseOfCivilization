import { MarkdownContent } from '../MarkdownContent/MarkdownContent';
import { SectionShell } from '../SectionShell/SectionShell';
import styles from './WikiDocument.styles.module.css';

interface WikiDocumentProps {
  id: string;
  markdown: string;
  sourceLabel: string;
  title: string;
}

function getStats(markdown: string) {
  return {
    headings: [...markdown.matchAll(/^##\s+/gm)].length,
    codeBlocks: [...markdown.matchAll(/```/gm)].length / 2,
    mermaidBlocks: [...markdown.matchAll(/```mermaid/gm)].length
  };
}

export function WikiDocument({ id, markdown, sourceLabel, title }: WikiDocumentProps) {
  const stats = getStats(markdown);

  return (
    <SectionShell id={id} title={title} sourceLabel={sourceLabel}>
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Wiki</span>
          <h3 className={styles.title}>{title} Document</h3>
          <p className={styles.copy}>
            Rendered directly from synced markdown so the portal stays aligned with the source
            docs.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.headings}</span>
            <span className={styles.statLabel}>Sections</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.codeBlocks}</span>
            <span className={styles.statLabel}>Code Blocks</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.mermaidBlocks}</span>
            <span className={styles.statLabel}>Mermaid</span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <MarkdownContent markdown={markdown} />
      </div>
    </SectionShell>
  );
}

import { MermaidDiagram } from '../../components/MermaidDiagram/MermaidDiagram';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import type { DiagramDefinition } from '../../types/content';
import styles from './DiagramsSection.styles.module.css';

interface DiagramsSectionProps {
  diagrams: DiagramDefinition[];
  sourceLabel: string;
}

export function DiagramsSection({
  diagrams,
  sourceLabel
}: DiagramsSectionProps) {
  return (
    <SectionShell id="diagrams" title="Architecture Diagrams" sourceLabel={sourceLabel}>
      <div className={styles.diagrams}>
        <div className={styles.header}>
          <div>
            <span className={styles.badge}>Graphs</span>
            <h3 className={styles.title}>Mermaid Diagram Explorer</h3>
            <p className={styles.copy}>
              Each architecture graph is pulled from the synced diagrams doc, rendered visually,
              and kept copy-paste friendly through raw Mermaid blocks.
            </p>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{diagrams.length}</span>
              <span className={styles.statLabel}>Diagrams</span>
            </div>
          </div>
        </div>

        {diagrams.length ? (
          diagrams.map((diagram, index) => (
            <MermaidDiagram key={diagram.title} diagram={diagram} index={index} />
          ))
        ) : (
          <p>No diagrams available.</p>
        )}
      </div>
    </SectionShell>
  );
}

import { useState } from 'react';
import { MermaidDiagram } from '../../components/MermaidDiagram/MermaidDiagram';
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import type { DocsPortalContent } from '../../types/content';
import styles from './TechView.styles.module.css';

export type TechSubTab = 'diagrams' | 'architecture' | 'technicalSolutions' | 'tools' | 'db' | 'server' | 'technologies';

interface TechViewProps {
  content: DocsPortalContent;
}

const TECH_SUB_TABS: Array<{ id: TechSubTab; label: string }> = [
  { id: 'diagrams', label: 'Diagrams' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'technicalSolutions', label: 'Technical Solutions' },
  { id: 'tools', label: 'Tools' },
  { id: 'db', label: 'DB' },
  { id: 'server', label: 'Server' },
  { id: 'technologies', label: 'Technologies' }
];

export function TechView({ content }: TechViewProps) {
  const [subTab, setSubTab] = useState<TechSubTab>('diagrams');

  const tech = content.tech ?? {
    diagrams: content.diagrams ?? [],
    architecture: content.docs?.architecture ?? '',
    technicalSolutions: [content.docs?.architecture, content.docs?.design].filter(Boolean).join('\n\n---\n\n'),
    tools: [content.docs?.localDev, content.docs?.storybook, content.docs?.deployment].filter(Boolean).join('\n\n---\n\n'),
    db: '',
    server: '',
    technologies: ''
  };

  return (
    <section className={styles.tech} aria-labelledby="tech-heading">
      <h2 id="tech-heading">Tech</h2>

      <div className={styles.subTabs}>
        {TECH_SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.subTab} ${subTab === tab.id ? styles.active : ''}`}
            onClick={() => setSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {subTab === 'diagrams' && (
          <div className={styles.diagrams}>
            {tech.diagrams?.length ? (
              tech.diagrams.map((diagram, index) => (
                <MermaidDiagram key={diagram.title} diagram={diagram} index={index} />
              ))
            ) : (
              <p>No diagrams available. Run <code>pnpm docs:sync</code> and ensure docs/architecture/diagrams.md has Mermaid blocks.</p>
            )}
          </div>
        )}

        {subTab === 'architecture' && (
          <MarkdownContent markdown={tech.architecture || content.docs?.architecture || ''} emptyMessage="No architecture content." />
        )}

        {subTab === 'technicalSolutions' && (
          <MarkdownContent markdown={tech.technicalSolutions || ''} emptyMessage="No technical solutions content." />
        )}

        {subTab === 'tools' && (
          <MarkdownContent markdown={tech.tools || ''} emptyMessage="No tools content." />
        )}

        {subTab === 'db' && (
          <MarkdownContent markdown={tech.db || 'See Architecture for durability boundaries and schema.'} />
        )}

        {subTab === 'server' && (
          <MarkdownContent markdown={tech.server || 'See Architecture for server responsibilities.'} />
        )}

        {subTab === 'technologies' && (
          <MarkdownContent markdown={tech.technologies || 'React, R3F, Fastify, Postgres, Redis, Docker.'} />
        )}
      </div>
    </section>
  );
}

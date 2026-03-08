import { useState } from 'react';
import { MermaidDiagram } from '../../components/MermaidDiagram/MermaidDiagram';
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import type { DocsPortalContent } from '../../types/content';
import styles from './TechView.styles.module.css';

export type TechSubTab = 'diagrams' | 'architecture' | 'tools' | 'db' | 'server' | 'technologies';

interface TechViewProps {
  content: DocsPortalContent;
}

const TECH_SUB_TABS: Array<{ id: TechSubTab; label: string }> = [
  { id: 'diagrams', label: 'Diagrams' },
  { id: 'architecture', label: 'Architecture' },
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
    tools: [content.docs?.localDev, content.docs?.storybook, content.docs?.deployment].filter(Boolean).join('\n\n---\n\n'),
    db: '',
    server: '',
    technologies: ''
  };

  return (
    <section className={styles.tech} aria-labelledby="tech-heading">
      <header className={styles.header}>
        <h2 id="tech-heading" className={styles.title}>Technical Reference</h2>
        <p className={styles.subtitle}>Architecture, diagrams, and development tools</p>
      </header>

      <nav className={styles.subTabs} aria-label="Tech sections">
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
      </nav>

      <div className={styles.panel}>
        {subTab === 'diagrams' && (
          <div className={styles.diagrams}>
            {tech.diagrams?.length ? (
              tech.diagrams.map((diagram, index) => (
                <div key={diagram.title} className={styles.diagramCard}>
                  <MermaidDiagram diagram={diagram} index={index} />
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No diagrams available. Run <code>pnpm docs:sync</code> and ensure docs/architecture/diagrams.md has Mermaid blocks.</p>
              </div>
            )}
          </div>
        )}

        {subTab === 'architecture' && (
          <div className={styles.markdownSection}>
            <MarkdownContent markdown={tech.architecture || content.docs?.architecture || ''} emptyMessage="No architecture content." />
          </div>
        )}

        {subTab === 'tools' && (
          <div className={styles.markdownSection}>
            <MarkdownContent markdown={tech.tools || ''} emptyMessage="No tools content." />
          </div>
        )}

        {subTab === 'db' && (
          <div className={styles.markdownSection}>
            <MarkdownContent markdown={tech.db || 'See Architecture for durability boundaries and schema.'} />
          </div>
        )}

        {subTab === 'server' && (
          <div className={styles.markdownSection}>
            <MarkdownContent markdown={tech.server || 'See Architecture for server responsibilities.'} />
          </div>
        )}

        {subTab === 'technologies' && (
          <div className={styles.markdownSection}>
            <MarkdownContent markdown={tech.technologies || 'React, R3F, Fastify, Postgres, Redis, Docker.'} />
          </div>
        )}
      </div>
    </section>
  );
}

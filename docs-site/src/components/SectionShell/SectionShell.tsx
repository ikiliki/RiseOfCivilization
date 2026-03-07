import type { PropsWithChildren } from 'react';
import styles from './SectionShell.styles.module.css';

interface SectionShellProps extends PropsWithChildren {
  id: string;
  title: string;
  sourceLabel: string;
}

export function SectionShell({ children, id, title, sourceLabel }: SectionShellProps) {
  return (
    <section id={id} className={`section reveal ${styles.sectionShell}`}>
      <div className="section-header">
        <h2>{title}</h2>
        <a className="meta-line" href={`#${id}`}>
          #{id}
        </a>
      </div>
      <p className="meta-line">
        Source: <code>{sourceLabel}</code>
      </p>
      {children}
    </section>
  );
}

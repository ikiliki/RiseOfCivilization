import { useEffect, useMemo, useState } from 'react';
import mermaid from 'mermaid';
import type { DiagramDefinition } from '../../types/content';
import styles from './MermaidDiagram.styles.module.css';

interface MermaidDiagramProps {
  diagram: DiagramDefinition;
  index: number;
}

export function MermaidDiagram({ diagram, index }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy Mermaid');
  const elementId = useMemo(() => `mermaid-diagram-${index}`, [index]);

  useEffect(() => {
    let isMounted = true;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose'
    });

    mermaid
      .render(elementId, diagram.code)
      .then((result) => {
        if (isMounted) {
          setSvg(result.svg);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSvg('');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [diagram.code, elementId]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(diagram.code);
      setCopyLabel('Copied');
      window.setTimeout(() => setCopyLabel('Copy Mermaid'), 1200);
    } catch {
      setCopyLabel('Copy failed');
      window.setTimeout(() => setCopyLabel('Copy Mermaid'), 1200);
    }
  }

  return (
    <details className="diagram" open={index === 0}>
      <summary>{diagram.title}</summary>
      <p className="diagram-intro">{diagram.intro}</p>
      <div className="diagram-toolbar">
        <button className="copy-btn" type="button" onClick={handleCopy}>
          {copyLabel}
        </button>
      </div>
      <pre>
        <code>{diagram.code}</code>
      </pre>
      <div className={`mermaid-wrap ${styles.mermaidWrap}`}>
        {svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <p className={styles.renderMessage}>Mermaid preview unavailable.</p>
        )}
      </div>
    </details>
  );
}

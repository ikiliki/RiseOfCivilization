import { useEffect, useMemo, useState } from 'react';
import mermaid from 'mermaid';
import styles from './EmbeddedMermaid.styles.module.css';

interface EmbeddedMermaidProps {
  code: string;
}

export function EmbeddedMermaid({ code }: EmbeddedMermaidProps) {
  const [svg, setSvg] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy Mermaid');
  const elementId = useMemo(
    () => `embedded-mermaid-${Math.random().toString(36).slice(2, 10)}`,
    []
  );

  useEffect(() => {
    let mounted = true;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose'
    });

    mermaid
      .render(elementId, code)
      .then((result) => {
        if (mounted) {
          setSvg(result.svg);
        }
      })
      .catch(() => {
        if (mounted) {
          setSvg('');
        }
      });

    return () => {
      mounted = false;
    };
  }, [code, elementId]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyLabel('Copied');
      window.setTimeout(() => setCopyLabel('Copy Mermaid'), 1200);
    } catch {
      setCopyLabel('Copy failed');
      window.setTimeout(() => setCopyLabel('Copy Mermaid'), 1200);
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <span className={styles.label}>Mermaid Graph</span>
        <button className="copy-btn" type="button" onClick={handleCopy}>
          {copyLabel}
        </button>
      </div>

      <pre className={styles.codePanel}>
        <code>{code}</code>
      </pre>

      <div className={styles.preview}>
        {svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <p className={styles.empty}>Mermaid preview unavailable.</p>
        )}
      </div>
    </div>
  );
}

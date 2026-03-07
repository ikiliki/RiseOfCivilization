import ReactMarkdown from 'react-markdown';
import { stripDocumentTitle } from '../../lib/markdown';
import { EmbeddedMermaid } from '../EmbeddedMermaid/EmbeddedMermaid';
import styles from './MarkdownContent.styles.module.css';

interface MarkdownContentProps {
  markdown: string;
  emptyMessage?: string;
}

export function MarkdownContent({
  markdown,
  emptyMessage = 'No content available.'
}: MarkdownContentProps) {
  const normalizedMarkdown = stripDocumentTitle(markdown || '');

  if (!normalizedMarkdown) {
    return <p>{emptyMessage}</p>;
  }

  function isEmbeddedMermaidChild(child: unknown) {
    return typeof child === 'object' && child !== null && 'type' in child && child.type === EmbeddedMermaid;
  }

  return (
    <div className={styles.markdownContent}>
      <ReactMarkdown
        components={{
          h2: ({ children }) => <h3>{children}</h3>,
          h3: ({ children }) => <h4>{children}</h4>,
          ul: ({ children }) => <ul className="list">{children}</ul>,
          ol: ({ children }) => <ol className="list">{children}</ol>,
          code: ({ children, className, ...props }) => {
            const isMermaid = className?.includes('language-mermaid');
            const value = String(children).replace(/\n$/, '');

            if (isMermaid) {
              return <EmbeddedMermaid code={value} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) =>
            (Array.isArray(children)
              ? children.some((child) => isEmbeddedMermaidChild(child))
              : isEmbeddedMermaidChild(children)) ? (
              <>{children}</>
            ) : (
              <pre>{children}</pre>
            ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          )
        }}
      >
        {normalizedMarkdown}
      </ReactMarkdown>
    </div>
  );
}

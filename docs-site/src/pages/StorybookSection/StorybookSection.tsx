import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import styles from './StorybookSection.styles.module.css';

interface StorybookSectionProps {
  iframeUrl?: string;
  markdown: string;
  sourceLabel: string;
}

export function StorybookSection({
  iframeUrl = 'http://localhost:6006',
  markdown,
  sourceLabel
}: StorybookSectionProps) {
  return (
    <SectionShell id="storybook" title="Storybook" sourceLabel={sourceLabel}>
      <div className="storybook-frame">
        <div className="storybook-toolbar">
          <h3>Embedded Storybook</h3>
          <div className="storybook-actions">
            <a className="copy-btn" href={iframeUrl} target="_blank" rel="noreferrer">
              Open in New Tab
            </a>
          </div>
        </div>
        <iframe
          className={`storybook-iframe ${styles.storybookIframe}`}
          title="Storybook Preview"
          src={iframeUrl}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="card">
        <MarkdownContent markdown={markdown} />
      </div>
    </SectionShell>
  );
}

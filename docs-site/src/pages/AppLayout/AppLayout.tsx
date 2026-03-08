import { useState } from 'react';
import { HubView } from '../HubView/HubView';
import { TechView } from '../TechView/TechView';
import type { DocsPortalContent } from '../../types/content';
import styles from './AppLayout.styles.module.css';

export type MainTab = 'hub' | 'tech';

interface AppLayoutProps {
  content: DocsPortalContent;
}

export function AppLayout({ content }: AppLayoutProps) {
  const [mainTab, setMainTab] = useState<MainTab>('hub');

  return (
    <div className={styles.layoutInner}>
      <nav className={styles.tabs} aria-label="Main navigation">
        <button
          type="button"
          className={`${styles.tab} ${mainTab === 'hub' ? styles.active : ''}`}
          onClick={() => setMainTab('hub')}
        >
          Hub
        </button>
        <button
          type="button"
          className={`${styles.tab} ${mainTab === 'tech' ? styles.active : ''}`}
          onClick={() => setMainTab('tech')}
        >
          Tech
        </button>
      </nav>

      <main className={styles.content}>
        {mainTab === 'hub' && <HubView content={content} />}
        {mainTab === 'tech' && <TechView content={content} />}
      </main>
    </div>
  );
}

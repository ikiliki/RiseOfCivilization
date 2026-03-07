import { useState } from 'react';
import { HomeView } from '../HomeView/HomeView';
import { PlanView } from '../PlanView/PlanView';
import { TechView } from '../TechView/TechView';
import type { DocsPortalContent } from '../../types/content';
import styles from './AppLayout.styles.module.css';

export type MainTab = 'home' | 'plan' | 'tech';

interface AppLayoutProps {
  content: DocsPortalContent;
}

export function AppLayout({ content }: AppLayoutProps) {
  const [mainTab, setMainTab] = useState<MainTab>('home');

  return (
    <div className={styles.layoutInner}>
      <nav className={styles.tabs} aria-label="Main navigation">
        <button
          type="button"
          className={`${styles.tab} ${mainTab === 'home' ? styles.active : ''}`}
          onClick={() => setMainTab('home')}
        >
          Home
        </button>
        <button
          type="button"
          className={`${styles.tab} ${mainTab === 'plan' ? styles.active : ''}`}
          onClick={() => setMainTab('plan')}
        >
          Plan
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
        {mainTab === 'home' && <HomeView content={content} />}
        {mainTab === 'plan' && <PlanView content={content} />}
        {mainTab === 'tech' && <TechView content={content} />}
      </main>
    </div>
  );
}

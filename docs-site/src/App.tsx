import { useEffect, useState } from 'react';
import { loadPortalContent } from './lib/content';
import { AppLayout } from './pages/AppLayout/AppLayout';

export function App() {
  const content = loadPortalContent();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress((doc.scrollTop / scrollable) * 100);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (!content || !content.sources) {
    return (
      <>
        <div className="bg-layer" aria-hidden="true" />
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">ROC</span>
            <div>
              <h1>Rise Of Civilization</h1>
              <p>Internal Documentation Portal</p>
            </div>
          </div>
        </header>
        <main className="content">
          <section className="section in">
            <h2>Content Not Generated Yet</h2>
            <p>
              Run <code>pnpm docs:sync</code> from the repository root, then refresh this page.
            </p>
          </section>
        </main>
      </>
    );
  }

  const currentFeature =
    (content.overview as { currentFeature?: string })?.currentFeature ??
    (content.overview as { currentPhase?: string })?.currentPhase ??
    (content.planStatus as { feature?: string })?.feature ??
    (content.planStatus as { phase?: string })?.phase ??
    'Unknown';

  return (
    <>
      <div className="bg-layer" aria-hidden="true" />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">ROC</span>
          <div>
            <h1>Rise Of Civilization</h1>
            <p>Internal Documentation Portal</p>
          </div>
        </div>
        <div className="topbar-meta">
          <span className="badge">Internal</span>
          <span className="badge">{currentFeature}</span>
        </div>
        <div className="scroll-progress">
          <span id="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
        </div>
      </header>

      <div className="content">
        <AppLayout content={content} />
      </div>
    </>
  );
}

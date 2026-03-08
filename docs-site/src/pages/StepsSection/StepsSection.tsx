import { useMemo } from 'react';
import { PhaseDashboard } from '../../components/PhaseDashboard/PhaseDashboard';
import type { PlanStatus } from '../../types/content';
import { extractRoadmapFeatures } from '../../lib/dashboard';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import styles from './StepsSection.styles.module.css';

interface StepsSectionProps {
  planStatus: PlanStatus;
  roadmapMarkdown: string;
  sourceLabel: string;
}

export function StepsSection({ planStatus, roadmapMarkdown, sourceLabel }: StepsSectionProps) {
  const phases = useMemo(
    () =>
      extractRoadmapFeatures(
        roadmapMarkdown,
        (planStatus as { feature?: string }).feature ?? (planStatus as { phase?: string }).phase ?? ''
      ),
    [roadmapMarkdown, planStatus]
  );
  const cards = [
    {
      title: 'Step 1: MVP',
      href: '#mvp',
      text: 'Baseline gameplay scope, deterministic shared world rules, and first-playable foundations.'
    },
    {
      title: 'Step 2: MULTI',
      href: '#multi',
      text: 'Completed: realtime presence, nearby sync, inspect flow, and stateless Redis fanout.'
    },
    {
      title: 'Current Feature',
      text:
        (planStatus as { feature?: string }).feature ?? (planStatus as { phase?: string }).phase ?? '',
      isPhase: true
    }
  ];

  return (
    <SectionShell id="steps" title="Steps" sourceLabel={sourceLabel}>
      <div className={styles.hero}>
        <h3>Implementation Progression</h3>
        <p>
          This roadmap view groups the major delivery features and shows where the current
          PBI sits relative to earlier completed milestones.
        </p>
      </div>

      <div className={`card-grid ${styles.cardGrid}`}>
        {cards.map((card) =>
          card.href ? (
            <a key={card.title} className="card" href={card.href}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </a>
          ) : (
            <article key={card.title} className="card">
              <h3>{card.title}</h3>
              {card.isPhase ? <div className="phase">{card.text}</div> : <p>{card.text}</p>}
            </article>
          )
        )}
      </div>

      <div className={styles.phaseBoard}>
        <div className={styles.boardHeader}>
          <h3>Feature Dashboard</h3>
          <p>Roadmap milestones from the synced implementation roadmap.</p>
        </div>
        <PhaseDashboard phases={phases} />
      </div>
    </SectionShell>
  );
}

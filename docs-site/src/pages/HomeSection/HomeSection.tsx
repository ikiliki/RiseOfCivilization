import { useMemo, useState } from 'react';
import { PhaseDashboard } from '../../components/PhaseDashboard/PhaseDashboard';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import { StatusFilters } from '../../components/StatusFilters/StatusFilters';
import { WorkItemsBoard } from '../../components/WorkItemsBoard/WorkItemsBoard';
import { extractRoadmapFeatures, filterWorkItems, getFeatureOptions, normalizeWorkItems } from '../../lib/dashboard';
import type { PlanStatus } from '../../types/content';
import styles from './HomeSection.styles.module.css';

interface HomeSectionProps {
  phase: string;
  projectSummary: string;
  roadmapMarkdown: string;
  sourceLabel: string;
  planStatus: PlanStatus;
}

const quickLinks = [
  ['MVP', '#mvp'],
  ['MULTI', '#multi'],
  ['Design', '#design'],
  ['Architecture', '#architecture'],
  ['Local Dev', '#local-dev'],
  ['Deployment', '#deployment'],
  ['Storybook', '#storybook'],
  ['Plan Status', '#plan-status']
];

export function HomeSection({
  phase,
  planStatus,
  projectSummary,
  roadmapMarkdown,
  sourceLabel
}: HomeSectionProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'done'>('all');
  const [phaseFilter, setPhaseFilter] = useState('all');

  const workItems = useMemo(() => normalizeWorkItems(planStatus), [planStatus]);
  const featureCards = useMemo(
    () => extractRoadmapFeatures(roadmapMarkdown, phase),
    [roadmapMarkdown, phase]
  );
  const filteredItems = useMemo(
    () => filterWorkItems(workItems, statusFilter, phaseFilter),
    [workItems, statusFilter, phaseFilter]
  );
  const featureOptions = useMemo(
    () => getFeatureOptions(workItems, featureCards),
    [workItems, featureCards]
  );
  const kpis = [
    { label: 'Completed', value: planStatus.completed.length },
    { label: 'Current Tasks', value: planStatus.current.length },
    { label: 'Next Tasks', value: planStatus.next.length },
    { label: 'Roadmap Features', value: featureCards.length }
  ];

  const cards = [
    { title: 'Project', text: 'Rise Of Civilization' },
    { title: 'Current PBI', text: phase, isPhase: true },
    {
      title: 'Portal Mode',
      text: 'Azure-style execution dashboard backed by synced markdown docs.'
    },
    {
      title: 'Source Of Truth',
      text: 'All cards, wiki pages, and diagrams read from docs-site/sync-docs.mjs output.'
    }
  ];

  return (
    <SectionShell id="home" title="Home" sourceLabel={sourceLabel}>
      <div className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Portfolio Dashboard</span>
          <h3>Execution Overview</h3>
          <p>{projectSummary}</p>
        </div>
        <div className={styles.heroPhase}>
          <span className={styles.heroLabel}>Active Feature</span>
          <div className="phase">{phase}</div>
        </div>
      </div>

      <div className={`kpi-grid ${styles.kpis}`}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi">
            <span className="value">{kpi.value}</span>
            <span className="label">{kpi.label}</span>
          </div>
        ))}
      </div>

      <div className={`card-grid ${styles.summaryGrid}`}>
        {cards.map((card) => (
          <article key={card.title} className="card">
            <h3>{card.title}</h3>
            {card.isPhase ? <div className="phase">{card.text}</div> : <p>{card.text}</p>}
          </article>
        ))}
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <h3>Feature Dashboard</h3>
          <p>Roadmap features rendered as Azure-style cards.</p>
        </div>
        <PhaseDashboard phases={featureCards} />
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <h3>PBI and Tasks</h3>
          <p>Filter execution work by status and feature while keeping the current PBI visible.</p>
        </div>
        <StatusFilters
          phaseFilter={phaseFilter}
          phaseOptions={featureOptions}
          statusFilter={statusFilter}
          totalCount={workItems.length}
          visibleCount={filteredItems.length}
          onPhaseChange={setPhaseFilter}
          onStatusChange={setStatusFilter}
        />
        <WorkItemsBoard items={filteredItems} pbiTitle={phase} />
      </div>

      <div className={`card-grid ${styles.quickLinks}`}>
        {quickLinks.map(([label, href]) => (
          <a key={label} className="card" href={href}>
            <h3>{label}</h3>
            <p>Open section</p>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

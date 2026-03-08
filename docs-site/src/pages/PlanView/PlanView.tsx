import { useState, useMemo } from 'react';
import { WorkItemsBoard } from '../../components/WorkItemsBoard/WorkItemsBoard';
import { StatusFilters } from '../../components/StatusFilters/StatusFilters';
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import {
  normalizeWorkItems,
  extractRoadmapFeatures,
  getFeatureOptions,
  filterWorkItems,
  type WorkItemStatus
} from '../../lib/dashboard';
import type { DocsPortalContent } from '../../types/content';
import styles from './PlanView.styles.module.css';

export type PlanSubTab = 'tasks' | 'board' | 'more';

interface PlanViewProps {
  content: DocsPortalContent;
}

export function PlanView({ content }: PlanViewProps) {
  const [subTab, setSubTab] = useState<PlanSubTab>('tasks');
  const [statusFilter, setStatusFilter] = useState<'all' | WorkItemStatus>('all');
  const [featureFilter, setFeatureFilter] = useState('all');

  const workItems = useMemo(() => {
    if (content.plan?.workItems?.length) {
      return content.plan.workItems;
    }
    if (content.planStatus) {
      return normalizeWorkItems(content.planStatus);
    }
    return [];
  }, [content.plan?.workItems, content.planStatus]);

  const currentFeatureLabel =
    (content.planStatus as { feature?: string })?.feature ??
    (content.planStatus as { phase?: string })?.phase ??
    (content.overview as { currentFeature?: string })?.currentFeature ??
    (content.overview as { currentPhase?: string })?.currentPhase ??
    'Unknown';

  const features = useMemo(() => {
    if ((content.plan as { features?: unknown[] })?.features?.length) {
      return (content.plan as { features: { id: string; title: string; summary?: string }[] }).features;
    }
    if (content.docs?.roadmap && currentFeatureLabel) {
      return extractRoadmapFeatures(content.docs.roadmap, currentFeatureLabel);
    }
    return [];
  }, [(content.plan as { features?: unknown[] })?.features, content.docs?.roadmap, currentFeatureLabel]);

  const featureOptions = useMemo(
    () => getFeatureOptions(workItems, features.map((f) => ({ title: f.title }))),
    [workItems, features]
  );

  const filteredItems = useMemo(
    () => filterWorkItems(workItems, statusFilter, featureFilter),
    [workItems, statusFilter, featureFilter]
  );

  const subTabs: Array<{ id: PlanSubTab; label: string }> = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'board', label: 'Board' },
    { id: 'more', label: 'More' }
  ];

  return (
    <section className={styles.plan} aria-labelledby="plan-heading">
      <h2 id="plan-heading">Plan</h2>

      <div className={styles.subTabs}>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.subTab} ${subTab === tab.id ? styles.active : ''}`}
            onClick={() => setSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'tasks' && (
        <div className={styles.tasksView}>
          <StatusFilters
            phaseFilter={featureFilter}
            phaseOptions={featureOptions}
            statusFilter={statusFilter}
            totalCount={workItems.length}
            visibleCount={filteredItems.length}
            onPhaseChange={setFeatureFilter}
            onStatusChange={(v) => setStatusFilter(v === 'all' ? 'all' : v)}
          />
          <div className={styles.taskList}>
            {filteredItems.length ? (
              filteredItems.map((item) => (
                <article key={item.id} className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <strong>{item.title}</strong>
                    <span className={`${styles.badge} ${styles[item.status]}`}>{item.status.replace('_', ' ')}</span>
                  </div>
                  <span className={styles.phaseBadge}>{(item as { feature?: string }).feature ?? (item as { phase?: string }).phase}</span>
                  {item.subTasks.length ? (
                    <ul className={styles.subTasks}>
                      {item.subTasks.map((st) => (
                        <li key={st}>{st}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))
            ) : (
              <p>No work items match the current filters.</p>
            )}
          </div>
        </div>
      )}

      {subTab === 'board' && (
        <WorkItemsBoard items={workItems} pbiTitle={currentFeatureLabel} />
      )}

      {subTab === 'more' && (
        <div className={styles.moreView}>
          <h3>Roadmap Features</h3>
          {features.length ? (
            <ul className="list">
              {features.map((f) => (
                <li key={f.id}>
                  <strong>{f.title}</strong>
                  {f.summary ? ` — ${f.summary}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>No roadmap features available.</p>
          )}
          {content.docs?.roadmap && (
            <>
              <h3>Full Roadmap</h3>
              <MarkdownContent markdown={content.docs.roadmap} />
            </>
          )}
        </div>
      )}
    </section>
  );
}

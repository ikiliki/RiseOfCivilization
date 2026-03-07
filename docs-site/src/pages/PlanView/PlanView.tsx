import { useState, useMemo } from 'react';
import { WorkItemsBoard } from '../../components/WorkItemsBoard/WorkItemsBoard';
import { StatusFilters } from '../../components/StatusFilters/StatusFilters';
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import {
  normalizeWorkItems,
  extractRoadmapPhases,
  getPhaseOptions,
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
  const [phaseFilter, setPhaseFilter] = useState('all');

  const workItems = useMemo(() => {
    if (content.plan?.workItems?.length) {
      return content.plan.workItems;
    }
    if (content.planStatus) {
      return normalizeWorkItems(content.planStatus);
    }
    return [];
  }, [content.plan?.workItems, content.planStatus]);

  const phases = useMemo(() => {
    if (content.plan?.phases?.length) {
      return content.plan.phases;
    }
    if (content.docs?.roadmap && content.planStatus?.phase) {
      return extractRoadmapPhases(content.docs.roadmap, content.planStatus.phase);
    }
    return [];
  }, [content.plan?.phases, content.docs?.roadmap, content.planStatus?.phase]);

  const phaseOptions = useMemo(
    () => getPhaseOptions(workItems, phases.map((p) => ({ title: p.title }))),
    [workItems, phases]
  );

  const filteredItems = useMemo(
    () => filterWorkItems(workItems, statusFilter, phaseFilter),
    [workItems, statusFilter, phaseFilter]
  );

  const currentPhase = content.overview?.currentPhase ?? content.planStatus?.phase ?? 'Unknown';

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
            phaseFilter={phaseFilter}
            phaseOptions={phaseOptions}
            statusFilter={statusFilter}
            totalCount={workItems.length}
            visibleCount={filteredItems.length}
            onPhaseChange={setPhaseFilter}
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
                  <span className={styles.phaseBadge}>{item.phase}</span>
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
        <WorkItemsBoard items={workItems} pbiTitle={currentPhase} />
      )}

      {subTab === 'more' && (
        <div className={styles.moreView}>
          <h3>Roadmap Milestones</h3>
          {phases.length ? (
            <ul className="list">
              {phases.map((p) => (
                <li key={p.id}>
                  <strong>{p.title}</strong>
                  {p.summary ? ` — ${p.summary}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>No roadmap phases available.</p>
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

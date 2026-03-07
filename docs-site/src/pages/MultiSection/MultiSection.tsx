import { extractListByHeading, extractRoadmapMilestone } from '../../lib/markdown';
import type { MultiSubStep, PlanStatus } from '../../types/content';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import styles from './MultiSection.styles.module.css';

interface MultiSectionProps {
  architectureMarkdown: string;
  multiSubSteps: MultiSubStep[];
  planStatus: PlanStatus;
  roadmapMarkdown: string;
  sourceLabel: string;
}

function renderList(items: string[]) {
  if (!items.length) {
    return <p>None.</p>;
  }

  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function MultiSection({
  architectureMarkdown,
  multiSubSteps,
  planStatus,
  roadmapMarkdown,
  sourceLabel
}: MultiSectionProps) {
  const phase2Roadmap = extractRoadmapMilestone(
    roadmapMarkdown,
    'Milestone 7: Phase 2 Multiplayer Foundation (Complete)'
  );
  const architecturePhase2 = extractListByHeading(
    architectureMarkdown,
    'Phase 2 Multiplayer (Implemented)'
  );
  const phase2FromPlan = planStatus.completed.filter((item) =>
    item.toLowerCase().includes('phase 2')
  );

  return (
    <SectionShell id="multi" title="Step 2: MULTI" sourceLabel={sourceLabel}>
      <div className="hero">
        <h3>Current Multiplayer Step</h3>
        <p>
          Phase 2 focuses on shared-world player presence and inspection, without
          moving to full server-authoritative gameplay yet.
        </p>
      </div>

      <article className="status-card done">
        <h3>Recent Session Sub-Steps</h3>
        <div className={`task-list ${styles.taskList}`}>
          {multiSubSteps.length ? (
            multiSubSteps.map((item) => (
              <article key={item.title} className="task-card">
                <div className="task-header">
                  <strong className="task-title">{item.title}</strong>
                </div>
                {item.subItems && item.subItems.length ? (
                  <details className="task-sub" open>
                    <summary>
                      {item.subItems.length} sub-item
                      {item.subItems.length === 1 ? '' : 's'}
                    </summary>
                    <ul className="sub-task-list">
                      {item.subItems.map((subItem) => (
                        <li key={subItem}>{subItem}</li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </article>
            ))
          ) : (
            <p>No sub-steps found.</p>
          )}
        </div>
      </article>

      <div className="status-grid">
        <article className="status-card done">
          <h3>Roadmap Milestone 7</h3>
          {renderList(phase2Roadmap)}
        </article>
        <article className="status-card next">
          <h3>Architecture Implementation Notes</h3>
          {renderList(architecturePhase2)}
        </article>
      </div>

      <article className="status-card">
        <h3>Plan Entries</h3>
        {renderList(phase2FromPlan)}
      </article>
    </SectionShell>
  );
}

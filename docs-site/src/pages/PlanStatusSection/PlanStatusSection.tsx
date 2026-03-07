import { useMemo, useState } from 'react';
import { PhaseDashboard } from '../../components/PhaseDashboard/PhaseDashboard';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import { StatusFilters } from '../../components/StatusFilters/StatusFilters';
import { WorkItemsBoard } from '../../components/WorkItemsBoard/WorkItemsBoard';
import {
  extractRoadmapPhases,
  filterWorkItems,
  getPhaseOptions,
  normalizeWorkItems
} from '../../lib/dashboard';
import type { PlanStatus } from '../../types/content';
import styles from './PlanStatusSection.styles.module.css';

interface PlanStatusSectionProps {
  planStatus: PlanStatus;
  roadmapMarkdown: string;
  sourceLabel: string;
}

export function PlanStatusSection({
  planStatus,
  roadmapMarkdown,
  sourceLabel
}: PlanStatusSectionProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'done'>('all');
  const [phaseFilter, setPhaseFilter] = useState('all');

  const workItems = useMemo(() => normalizeWorkItems(planStatus), [planStatus]);
  const phaseCards = useMemo(
    () => extractRoadmapPhases(roadmapMarkdown, planStatus.phase),
    [roadmapMarkdown, planStatus.phase]
  );
  const phaseOptions = useMemo(
    () => getPhaseOptions(workItems, phaseCards),
    [workItems, phaseCards]
  );
  const filteredItems = useMemo(
    () => filterWorkItems(workItems, statusFilter, phaseFilter),
    [workItems, statusFilter, phaseFilter]
  );

  return (
    <SectionShell id="plan-status" title="Plan Status" sourceLabel={sourceLabel}>
      <div className={styles.header}>
        <div className={styles.phaseCard}>
          <span className={styles.eyebrow}>Current PBI</span>
          <h3>{planStatus.phase}</h3>
          <p className={styles.phaseHint}>
            The active phase is the top-level PBI. The board below breaks the work into done,
            current, and next execution items.
          </p>
        </div>

        <div className={styles.statCards}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{planStatus.completed.length}</span>
            <span className={styles.statLabel}>Done</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{planStatus.current.length}</span>
            <span className={styles.statLabel}>Current</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{planStatus.next.length}</span>
            <span className={styles.statLabel}>Next</span>
          </div>
        </div>
      </div>

      <div className={styles.phaseDashboard}>
        <div className={styles.blockHeader}>
          <h3>Phase Status</h3>
          <p>Milestones derived from the synced implementation roadmap.</p>
        </div>
        <PhaseDashboard phases={phaseCards} />
      </div>

      <div className={styles.board}>
        <div className={styles.blockHeader}>
          <h3>Task Board</h3>
          <p>Filter work items by phase or status to narrow the current execution set.</p>
        </div>
        <StatusFilters
          phaseFilter={phaseFilter}
          phaseOptions={phaseOptions}
          statusFilter={statusFilter}
          totalCount={workItems.length}
          visibleCount={filteredItems.length}
          onPhaseChange={setPhaseFilter}
          onStatusChange={setStatusFilter}
        />
        <WorkItemsBoard items={filteredItems} pbiTitle={planStatus.phase} />
      </div>
    </SectionShell>
  );
}

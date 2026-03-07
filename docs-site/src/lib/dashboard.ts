import type { PlanStatus, PlanTask } from '../types/content';

export type WorkItemStatus = 'new' | 'in_progress' | 'done';
export type PhaseState = 'done' | 'active' | 'planned';

export interface WorkItem {
  id: string;
  title: string;
  status: WorkItemStatus;
  phase: string;
  subTasks: string[];
}

export interface PhaseSummary {
  id: string;
  title: string;
  summary: string;
  status: PhaseState;
  bullets: string[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeTask(input: string | PlanTask): PlanTask {
  if (typeof input === 'string') {
    return { title: input, subTasks: [] };
  }

  return {
    title: input.title,
    subTasks: input.subTasks ?? []
  };
}

function classifyPhase(title: string, currentPhase: string) {
  const normalized = `${title} ${currentPhase}`.toLowerCase();

  if (
    /phase 3|operations|hardening|runbook|observability|integration test|contract test|docs portal|quality|debug/i.test(
      normalized
    )
  ) {
    return 'Phase 3';
  }

  if (/phase 2\.5|redis|stateless|pub\/sub|fanout|live-player|admin/i.test(normalized)) {
    return 'Phase 2.5';
  }

  if (/phase 2|multiplayer|presence|websocket|inspect|remote player/i.test(normalized)) {
    return 'Phase 2';
  }

  if (
    /mvp|first playable|spawn|world|chunk|hud|settings|bootstrap|frontend|backend core/i.test(
      normalized
    )
  ) {
    return 'MVP';
  }

  return 'General';
}

export function normalizeWorkItems(planStatus: PlanStatus): WorkItem[] {
  const completed = planStatus.completed.map((title) => ({
    id: `done-${slugify(title)}`,
    title,
    status: 'done' as const,
    phase: classifyPhase(title, planStatus.phase),
    subTasks: []
  }));

  const current = planStatus.current.map((item) => {
    const task = normalizeTask(item);
    return {
      id: `current-${slugify(task.title)}`,
      title: task.title,
      status: 'in_progress' as const,
      phase: classifyPhase(task.title, planStatus.phase),
      subTasks: task.subTasks ?? []
    };
  });

  const next = planStatus.next.map((item) => {
    const task = normalizeTask(item);
    return {
      id: `next-${slugify(task.title)}`,
      title: task.title,
      status: 'new' as const,
      phase: classifyPhase(task.title, planStatus.phase),
      subTasks: task.subTasks ?? []
    };
  });

  return [...completed, ...current, ...next];
}

export function extractRoadmapPhases(roadmapMarkdown: string, currentPhase: string): PhaseSummary[] {
  const withSentinel = `${roadmapMarkdown}\n### `;
  const headingRegex = /^###\s+(Milestone\s+\d+:\s+.+?)$/gm;
  const matches = [...withSentinel.matchAll(headingRegex)];

  return matches.map((match, index) => {
    const rawTitle = match[1].trim();
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? withSentinel.length;
    const section = withSentinel.slice(start, end);
    const bullets = [...section.matchAll(/^- (.+)$/gm)].map((item) => item[1].trim());
    const summary = bullets[0] ?? 'Roadmap milestone.';
    const normalizedTitle = rawTitle.toLowerCase();
    const normalizedCurrentPhase = currentPhase.toLowerCase();

    let status: PhaseState = 'planned';
    if (normalizedTitle.includes('(complete)')) {
      status = 'done';
    } else if (
      normalizedTitle.includes('(current)') ||
      normalizedTitle.includes(normalizedCurrentPhase)
    ) {
      status = 'active';
    }

    return {
      id: slugify(rawTitle),
      title: rawTitle.replace(/\s+\((Complete|Current)\)$/i, ''),
      summary,
      status,
      bullets
    };
  });
}

export function getPhaseOptions(
  items: WorkItem[],
  phases: Array<{ title: string }>
): string[] {
  return [...new Set([...phases.map((p) => p.title), ...items.map((item) => item.phase)])];
}

export function filterWorkItems(
  items: WorkItem[],
  statusFilter: 'all' | WorkItemStatus,
  phaseFilter: string
): WorkItem[] {
  return items.filter((item) => {
    const statusMatches = statusFilter === 'all' || item.status === statusFilter;
    const phaseMatches = phaseFilter === 'all' || item.phase === phaseFilter;
    return statusMatches && phaseMatches;
  });
}

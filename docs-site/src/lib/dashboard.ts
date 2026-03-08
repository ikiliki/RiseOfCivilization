import type { PlanStatus, PlanTask } from '../types/content';

export type WorkItemStatus = 'new' | 'in_progress' | 'done';
export type PhaseState = 'done' | 'active' | 'planned';

export interface WorkItem {
  id: string;
  title: string;
  status: WorkItemStatus;
  feature: string;
  subTasks: string[];
}

export interface FeatureSummary {
  id: string;
  title: string;
  summary: string;
  status: PhaseState;
  bullets: string[];
}

/** @deprecated Use FeatureSummary */
export type PhaseSummary = FeatureSummary;

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

function classifyFeature(title: string, currentFeature: string) {
  const normalized = `${title} ${currentFeature}`.toLowerCase();

  if (
    /operations|hardening|runbook|observability|integration test|contract test|docs portal|documentation hub|quality|debug/i.test(
      normalized
    )
  ) {
    return '1.3';
  }

  if (/redis|stateless|pub\/sub|fanout|live-player|admin/i.test(normalized)) {
    return '1.2';
  }

  if (/multiplayer|presence|websocket|inspect|remote player/i.test(normalized)) {
    return '1.1';
  }

  if (
    /mvp|first playable|spawn|world|chunk|hud|settings|bootstrap|frontend|backend core/i.test(
      normalized
    )
  ) {
    return '1';
  }

  return '1.3';
}

export function normalizeWorkItems(planStatus: PlanStatus): WorkItem[] {
  const currentFeature = (planStatus as { feature?: string }).feature ?? (planStatus as { phase?: string }).phase ?? '';
  const completed = planStatus.completed.map((title) => ({
    id: `done-${slugify(title)}`,
    title,
    status: 'done' as const,
    feature: classifyFeature(title, currentFeature),
    subTasks: []
  }));

  const current = planStatus.current.map((item) => {
    const task = normalizeTask(item);
    return {
      id: `current-${slugify(task.title)}`,
      title: task.title,
      status: 'in_progress' as const,
      feature: classifyFeature(task.title, currentFeature),
      subTasks: task.subTasks ?? []
    };
  });

  const next = planStatus.next.map((item) => {
    const task = normalizeTask(item);
    return {
      id: `next-${slugify(task.title)}`,
      title: task.title,
      status: 'new' as const,
      feature: classifyFeature(task.title, currentFeature),
      subTasks: task.subTasks ?? []
    };
  });

  return [...completed, ...current, ...next];
}

export function extractRoadmapFeatures(roadmapMarkdown: string, currentFeature: string): FeatureSummary[] {
  const withSentinel = `${roadmapMarkdown}\n### `;
  const headingRegex = /^###\s+Feature\s+([\d.]+):\s+(.+?)(?:\s+\((Complete|Current)\))?\s*$/gm;
  const matches = [...withSentinel.matchAll(headingRegex)];

  return matches.map((match, index) => {
    const id = match[1].trim();
    const rawTitle = match[2].trim();
    const suffix = (match[3] || '').toLowerCase();
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? withSentinel.length;
    const section = withSentinel.slice(start, end);
    const bullets = [...section.matchAll(/^- (.+)$/gm)].map((item) => item[1].trim());
    const summary = bullets[0] ?? 'Roadmap feature.';
    const normalizedCurrentFeature = currentFeature.toLowerCase();

    let status: PhaseState = 'planned';
    if (suffix === 'complete') {
      status = 'done';
    } else if (suffix === 'current' || normalizedCurrentFeature.includes(id) || normalizedCurrentFeature.includes(rawTitle.toLowerCase())) {
      status = 'active';
    }

    return {
      id,
      title: `Feature ${id}: ${rawTitle}`,
      summary,
      status,
      bullets
    };
  });
}

export function getFeatureOptions(
  items: WorkItem[],
  features: Array<{ title: string }>
): string[] {
  return [...new Set([...features.map((p) => p.title), ...items.map((item) => item.feature)])];
}

export function filterWorkItems(
  items: WorkItem[],
  statusFilter: 'all' | WorkItemStatus,
  featureFilter: string
): WorkItem[] {
  return items.filter((item) => {
    const statusMatches = statusFilter === 'all' || item.status === statusFilter;
    const featureMatches = featureFilter === 'all' || item.feature === featureFilter;
    return statusMatches && featureMatches;
  });
}

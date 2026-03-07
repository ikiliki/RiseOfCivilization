export interface PlanTask {
  title: string;
  subTasks?: string[];
}

export interface MultiSubStep {
  title: string;
  subItems?: string[];
}

export interface DiagramDefinition {
  title: string;
  intro: string;
  code: string;
}

export interface DocsMap {
  docsReadme: string;
  mvp: string;
  design: string;
  architecture: string;
  diagramsDoc: string;
  localDev: string;
  deployment: string;
  storybook: string;
  roadmap: string;
  plan: string;
  changelog?: string;
}

export interface PlanStatus {
  phase: string;
  completed: string[];
  current: Array<string | PlanTask>;
  next: Array<string | PlanTask>;
}

export type WorkItemStatus = 'new' | 'in_progress' | 'done';

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
  status: 'new' | 'in_progress' | 'done';
  summary?: string;
}

export interface Overview {
  projectSummary: string;
  currentPhase: string;
  lastUpdated: string;
}

export interface TechSections {
  diagrams: DiagramDefinition[];
  architecture: string;
  technicalSolutions: string;
  tools: string;
  db: string;
  server: string;
  technologies: string;
}

export interface DocsPortalContent {
  generatedAt: string;
  sources: Record<string, string>;
  docs: DocsMap;
  planStatus: PlanStatus;
  diagrams: DiagramDefinition[];
  multiSubSteps?: MultiSubStep[];
  overview?: Overview;
  plan?: {
    phases: PhaseSummary[];
    workItems: WorkItem[];
  };
  tech?: TechSections;
}

declare global {
  interface Window {
    DOCS_PORTAL_CONTENT?: DocsPortalContent;
  }
}

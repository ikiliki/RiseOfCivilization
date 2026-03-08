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
}

export interface PlanStatus {
  feature: string;
  completed: string[];
  current: Array<string | PlanTask>;
  next: Array<string | PlanTask>;
}

export type WorkItemStatus = 'new' | 'in_progress' | 'done';

export interface WorkItem {
  id: string;
  title: string;
  status: WorkItemStatus;
  feature: string;
  subTasks: string[];
}

export type FeatureStatus = 'planned' | 'in_progress' | 'done';

export interface FeatureSummary {
  id: string;
  title: string;
  status: FeatureStatus;
  summary?: string;
}

/** @deprecated Use FeatureSummary */
export type PhaseSummary = FeatureSummary;

export interface Overview {
  projectSummary: string;
  currentFeature: string;
  lastUpdated: string;
}

export interface TechSections {
  diagrams: DiagramDefinition[];
  architecture: string;
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
    features: FeatureSummary[];
    workItems: WorkItem[];
  };
  tech?: TechSections;
}

declare global {
  interface Window {
    DOCS_PORTAL_CONTENT?: DocsPortalContent;
  }
}

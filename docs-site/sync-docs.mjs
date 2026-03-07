import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(process.cwd());
const docsSiteRoot = resolve(repoRoot, "docs-site");

const sources = [
  { key: "docsReadme", path: "docs/README.md" },
  { key: "mvp", path: "docs/mvp/mvp-scope.md" },
  { key: "design", path: "docs/design/game-design-brief.md" },
  { key: "architecture", path: "docs/architecture/technical-architecture.md" },
  { key: "diagramsDoc", path: "docs/architecture/diagrams.md" },
  { key: "localDev", path: "docs/dev/local-development.md" },
  { key: "deployment", path: "docs/dev/deployment-strategy.md" },
  { key: "storybook", path: "docs/ui/storybook-plan.md" },
  { key: "roadmap", path: "docs/product/implementation-roadmap.md" },
  { key: "plan", path: "PLAN.md" },
  { key: "changelog", path: "docs/changelog-session-summary.md" },
];

function readText(relativePath) {
  return readFileSync(resolve(repoRoot, relativePath), "utf8").replace(
    /\r\n/g,
    "\n"
  );
}

function pickList(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const withSentinel = markdown + "\n## ";
  const pattern = new RegExp(
    `^##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=^##\\s+)`,
    "m"
  );
  const section = withSentinel.match(pattern)?.[1] ?? "";
  return [...section.matchAll(/^- (.+)$/gm)].map((m) => m[1].trim());
}

/**
 * Extracts list items with optional nested sub-tasks (2+ space indent before -).
 * Returns Array<{ title: string, subTasks: string[] }>.
 */
function pickListWithSubTasks(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const withSentinel = markdown + "\n## ";
  const pattern = new RegExp(
    `^##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=^##\\s+)`,
    "m"
  );
  const section = withSentinel.match(pattern)?.[1] ?? "";
  const lines = section.split("\n");
  const result = [];
  let current = null;

  for (const line of lines) {
    const mainMatch = line.match(/^- (.+)$/);
    const subMatch = line.match(/^  +- (.+)$/);

    if (mainMatch) {
      if (current) result.push(current);
      current = { title: mainMatch[1].trim(), subTasks: [] };
    } else if (subMatch && current) {
      current.subTasks.push(subMatch[1].trim());
    }
  }
  if (current) result.push(current);
  return result;
}

function pickSingleBullet(markdown, heading) {
  const list = pickList(markdown, heading);
  return list[0] || "";
}

function extractMermaidDiagrams(markdown) {
  const diagrams = [];
  const headingRegex = /^##\s+(Diagram\s+\d+:\s+.+)$/gm;
  const headings = [...markdown.matchAll(headingRegex)].map((match) => ({
    title: match[1].trim(),
    index: match.index ?? 0,
  }));

  const codeRegex = /```mermaid\n([\s\S]*?)```/gm;
  const codes = [...markdown.matchAll(codeRegex)].map((match) => ({
    code: match[1].trim(),
    index: match.index ?? 0,
  }));

  for (let i = 0; i < Math.min(headings.length, codes.length); i += 1) {
    const title = headings[i].title;
    const start = headings[i].index;
    const end = codes[i].index;
    const blockText = markdown.slice(start, end);
    const introLine = blockText
      .split("\n")
      .map((line) => line.trim())
      .find(
        (line) =>
          line &&
          !line.startsWith("## ") &&
          !line.startsWith("- ") &&
          !line.startsWith("This diagram")
      );

    diagrams.push({
      title,
      intro: introLine || "Architecture diagram",
      code: codes[i].code,
    });
  }

  return diagrams;
}

/**
 * Extracts top-level sections (## 1. Title, ## 2. Title, etc.) from changelog as multi sub-steps.
 * Returns Array<{ title: string, subItems: string[] }> where subItems are ### headings.
 */
function extractChangelogMultiSubSteps(markdown) {
  const withSentinel = (markdown || "") + "\n## ";
  const sectionRegex = /^##\s+(\d+\.\s+.+?)\s*$/gm;
  const subRegex = /^###\s+(.+?)\s*$/gm;
  const sections = [];
  let match;
  const titles = [];
  while ((match = sectionRegex.exec(withSentinel)) !== null) {
    titles.push({ title: match[1].trim(), index: match.index });
  }
  for (let i = 0; i < titles.length; i += 1) {
    const start = titles[i].index;
    const end = titles[i + 1]?.index ?? withSentinel.length;
    const block = withSentinel.slice(start, end);
    const subItems = [...block.matchAll(subRegex)].map((m) => m[1].trim());
    sections.push({ title: titles[i].title, subItems });
  }
  return sections;
}

const raw = Object.fromEntries(sources.map((entry) => [entry.key, readText(entry.path)]));

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractOverview(raw) {
  const summaryMatch = (raw.docsReadme || "").match(/## Project Summary\s*([\s\S]*?)(?=##\s+|$)/m);
  const phase =
    pickSingleBullet(raw.plan, "Current phase") ||
    pickSingleBullet(raw.plan, "Current Phase");
  const lastMatch = (raw.plan || "").match(/## Last Updated\s*\n-?\s*(.+?)(?:\n|$)/m);
  return {
    projectSummary: summaryMatch?.[1]?.trim() || "Internal docs portal for Rise Of Civilization.",
    currentPhase: phase || "Unknown",
    lastUpdated: lastMatch?.[1]?.trim() || new Date().toISOString().slice(0, 10),
  };
}

function extractPhases(raw) {
  const phases = [];
  const roadmap = raw.roadmap || "";
  const withSentinel = roadmap + "\n### ";
  const headingRegex = /^###\s+(Milestone\s+\d+:\s+.+?)$/gm;
  let match;
  const matches = [];
  while ((match = headingRegex.exec(withSentinel)) !== null) {
    matches.push({ title: match[1].trim(), index: match.index });
  }
  const currentPhase =
    pickSingleBullet(raw.plan, "Current phase") ||
    pickSingleBullet(raw.plan, "Current Phase");
  const normalizedCurrent = (currentPhase || "").toLowerCase();

  for (let i = 0; i < matches.length; i++) {
    const rawTitle = matches[i].title;
    const start = matches[i].index;
    const end = matches[i + 1]?.index ?? withSentinel.length;
    const section = withSentinel.slice(start, end);
    const bullets = [...section.matchAll(/^- (.+)$/gm)].map((m) => m[1].trim());
    const normalizedTitle = rawTitle.toLowerCase();
    let status = "planned";
    if (normalizedTitle.includes("(complete)")) status = "done";
    else if (normalizedTitle.includes("(current)") || normalizedTitle.includes(normalizedCurrent))
      status = "in_progress";

    phases.push({
      id: slugify(rawTitle),
      title: rawTitle.replace(/\s+\((Complete|Current)\)$/i, ""),
      status,
      summary: bullets[0] || "",
    });
  }
  return phases;
}

function extractWorkItems(raw) {
  const phase =
    pickSingleBullet(raw.plan, "Current phase") ||
    pickSingleBullet(raw.plan, "Current Phase");
  const completed = pickList(raw.plan, "Done").length
    ? pickList(raw.plan, "Done")
    : pickList(raw.plan, "Completed");
  const current =
    pickListWithSubTasks(raw.plan, "In progress").length
      ? pickListWithSubTasks(raw.plan, "In progress")
      : pickListWithSubTasks(raw.plan, "In Progress");
  const next = pickListWithSubTasks(raw.plan, "Next");

  function classifyPhase(title) {
    const n = `${title} ${phase}`.toLowerCase();
    if (/phase 3|operations|hardening|runbook|observability/i.test(n)) return "Phase 3";
    if (/phase 2\.5|redis|stateless|pub\/sub|fanout|admin/i.test(n)) return "Phase 2.5";
    if (/phase 2|multiplayer|presence|websocket|inspect/i.test(n)) return "Phase 2";
    if (/mvp|first playable|spawn|world|chunk|hud|settings/i.test(n)) return "MVP";
    return "General";
  }

  const items = [];
  completed.forEach((title) => {
    items.push({
      id: `done-${slugify(title)}`,
      title,
      status: "done",
      phase: classifyPhase(title),
      subTasks: [],
    });
  });
  current.forEach((item) => {
    const task = typeof item === "string" ? { title: item, subTasks: [] } : item;
    items.push({
      id: `current-${slugify(task.title)}`,
      title: task.title,
      status: "in_progress",
      phase: classifyPhase(task.title),
      subTasks: task.subTasks || [],
    });
  });
  next.forEach((item) => {
    const task = typeof item === "string" ? { title: item, subTasks: [] } : item;
    items.push({
      id: `next-${slugify(task.title)}`,
      title: task.title,
      status: "new",
      phase: classifyPhase(task.title),
      subTasks: task.subTasks || [],
    });
  });
  return items;
}

function extractTechSections(raw) {
  const arch = raw.architecture || "";
  const multi = raw.multiplayerFlow || "";
  const localDev = raw.localDev || "";
  const storybook = raw.storybook || "";
  const deployment = raw.deployment || "";

  const dbSection = [
    "## Durability Boundaries",
    arch.match(/## Durability Boundaries\s*([\s\S]*?)(?=##\s+|$)/m)?.[1] || "",
    "",
    "## Redis Key Strategy (from multiplayer-flow-and-debug.md)",
    multi.match(/## Redis Key and Channel Strategy\s*([\s\S]*?)(?=##\s+|$)/m)?.[1] || "",
  ]
    .join("\n")
    .trim();

  const serverSection = [
    "## Server Responsibilities",
    arch.match(/## Server Responsibilities\s*([\s\S]*?)(?=##\s+|$)/m)?.[1] || "",
    "",
    "## Stateless Gateway",
    arch.match(/## Stateless Gateway Responsibilities\s*([\s\S]*?)(?=##\s+|$)/m)?.[1] || "",
    "",
    "## End-to-End Flow",
    multi.match(/## End-to-End Flow\s*([\s\S]*?)(?=##\s+|$)/m)?.[1] || "",
  ]
    .join("\n")
    .trim();

  const toolsSection = [
    "## Local Development",
    localDev,
    "",
    "## Storybook",
    storybook,
    "",
    "## Deployment",
    deployment,
  ]
    .join("\n\n")
    .trim();

  const techStack = [
    "## Client",
    "- React, TypeScript, Vite",
    "- react-three-fiber (R3F), Three.js",
    "- packages/ui, packages/shared-types",
    "",
    "## Server",
    "- Node.js, TypeScript, Fastify",
    "- @fastify/websocket",
    "- ioredis",
    "",
    "## Data",
    "- PostgreSQL (durable)",
    "- Redis (ephemeral presence, pub/sub)",
    "",
    "## Dev",
    "- pnpm workspaces, Docker Compose",
    "- ESLint, Prettier, Vitest",
    "- Storybook (UI only)",
  ].join("\n");

  return {
    architecture: arch,
    technicalSolutions: arch + "\n\n---\n\n" + (raw.design || ""),
    tools: toolsSection,
    db: dbSection || "See Architecture for durability boundaries.",
    server: serverSection || "See Architecture for server responsibilities.",
    technologies: techStack,
  };
}

const planStatus = {
  phase:
    pickSingleBullet(raw.plan, "Current phase") ||
    pickSingleBullet(raw.plan, "Current Phase"),
  completed: pickList(raw.plan, "Done").length
    ? pickList(raw.plan, "Done")
    : pickList(raw.plan, "Completed"),
  current:
    pickListWithSubTasks(raw.plan, "In progress").length
      ? pickListWithSubTasks(raw.plan, "In progress")
      : pickListWithSubTasks(raw.plan, "In Progress"),
  next: pickListWithSubTasks(raw.plan, "Next"),
};

const diagrams = extractMermaidDiagrams(raw.diagramsDoc);
const multiSubSteps = extractChangelogMultiSubSteps(raw.changelog);

const multiplayerFlow = readText(resolve(repoRoot, "docs/dev/multiplayer-flow-and-debug.md")).replace(
  /\r\n/g,
  "\n"
);
const rawWithMulti = { ...raw, multiplayerFlow };

const data = {
  generatedAt: new Date().toISOString(),
  sources: Object.fromEntries(sources.map((entry) => [entry.key, entry.path])),
  docs: raw,
  planStatus,
  diagrams,
  multiSubSteps,
  overview: extractOverview(raw),
  plan: {
    phases: extractPhases(raw),
    workItems: extractWorkItems(raw),
  },
  tech: {
    diagrams,
    ...extractTechSections(rawWithMulti),
  },
};

const targetFile = resolve(docsSiteRoot, "content.generated.js");
const content = `window.DOCS_PORTAL_CONTENT = ${JSON.stringify(data, null, 2)};\n`;
writeFileSync(targetFile, content, "utf8");
console.log("Generated docs-site/content.generated.js");

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(process.cwd());
const docsSiteRoot = resolve(repoRoot, "docs-site");

const sources = [
  { key: "docsReadme", path: "docs/README.md" },
  { key: "projectRules", path: "docs/project-rules.md" },
  { key: "mvp", path: "docs/mvp/mvp-scope.md" },
  { key: "design", path: "docs/design/game-design-brief.md" },
  { key: "architecture", path: "docs/architecture/technical-architecture.md" },
  { key: "diagramsDoc", path: "docs/architecture/diagrams.md" },
  { key: "localDev", path: "docs/dev/local-development.md" },
  { key: "deployment", path: "docs/dev/deployment-strategy.md" },
  { key: "storybook", path: "docs/ui/storybook-plan.md" },
  { key: "roadmap", path: "docs/product/implementation-roadmap.md" },
  { key: "plan", path: "PLAN.md" },
  // Feature docs: add as needed, e.g. { key: "featureX", path: "docs/features/feature-x.md" },
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

  // Sort by diagram number ascending (1, 2, 3, ... 10)
  const diagramNum = (d) => {
    const m = d.title.match(/Diagram\s+(\d+)/i);
    return m ? parseInt(m[1], 10) : 999;
  };
  diagrams.sort((a, b) => diagramNum(a) - diagramNum(b));
  return diagrams;
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
  const feature =
    pickSingleBullet(raw.plan, "Current feature") ||
    pickSingleBullet(raw.plan, "Current Feature");
  const lastMatch = (raw.plan || "").match(/## Last Updated\s*\n-?\s*(.+?)(?:\n|$)/m);
  return {
    projectSummary: summaryMatch?.[1]?.trim() || "Internal docs portal for Rise Of Civilization.",
    currentFeature: feature || "Unknown",
    lastUpdated: lastMatch?.[1]?.trim() || new Date().toISOString().slice(0, 10),
  };
}

/**
 * Extracts features from roadmap (Feature 1, 1.1, 1.2, 1.3) and PLAN.md.
 * Returns Array<{ id: string, title: string, status: string, summary: string }>.
 */
function extractFeatures(raw) {
  const features = [];
  const roadmap = raw.roadmap || "";
  const withSentinel = roadmap + "\n### ";
  const headingRegex = /^###\s+Feature\s+([\d.]+):\s+(.+?)(?:\s+\((Complete|Current)\))?\s*$/gm;
  let match;
  const matches = [];
  while ((match = headingRegex.exec(withSentinel)) !== null) {
    matches.push({
      id: match[1].trim(),
      title: match[2].trim(),
      suffix: (match[3] || "").toLowerCase(),
      index: match.index,
    });
  }
  const currentFeature =
    pickSingleBullet(raw.plan, "Current feature") ||
    pickSingleBullet(raw.plan, "Current Feature");
  const normalizedCurrent = (currentFeature || "").toLowerCase();

  for (let i = 0; i < matches.length; i++) {
    const { id, title, suffix } = matches[i];
    const start = matches[i].index;
    const end = matches[i + 1]?.index ?? withSentinel.length;
    const section = withSentinel.slice(start, end);
    const bullets = [...section.matchAll(/^- (.+)$/gm)].map((m) => m[1].trim());
    let status = "planned";
    if (suffix === "complete") status = "done";
    else if (suffix === "current" || normalizedCurrent.includes(id) || normalizedCurrent.includes(title.toLowerCase()))
      status = "in_progress";

    features.push({
      id,
      title: `Feature ${id}: ${title}`,
      status,
      summary: bullets[0] || "",
    });
  }
  // Sort by feature number ascending: 1, 1.1, 1.2, 1.3
  const parseId = (fid) => fid.split(".").map(Number);
  const compare = (a, b) => {
    const pa = parseId(a.id);
    const pb = parseId(b.id);
    for (let j = 0; j < Math.max(pa.length, pb.length); j++) {
      const va = pa[j] ?? 0;
      const vb = pb[j] ?? 0;
      if (va !== vb) return va - vb;
    }
    return 0;
  };
  features.sort(compare);
  return features;
}

function extractWorkItems(raw) {
  const currentFeature =
    pickSingleBullet(raw.plan, "Current feature") ||
    pickSingleBullet(raw.plan, "Current Feature");
  const completed = pickList(raw.plan, "Done").length
    ? pickList(raw.plan, "Done")
    : pickList(raw.plan, "Completed");
  const current =
    pickListWithSubTasks(raw.plan, "In progress").length
      ? pickListWithSubTasks(raw.plan, "In progress")
      : pickListWithSubTasks(raw.plan, "In Progress");
  const next = pickListWithSubTasks(raw.plan, "Next");

  function classifyFeature(title) {
    const n = title.toLowerCase();
    if (/mvp|first playable|spawn|world|chunk|hud|settings|bootstrap|frontend|backend core|monorepo|workspace|docker|fastify|postgres|world-engine/i.test(n))
      return "1";
    if (/multiplayer|presence|websocket|inspect|remote player/i.test(n)) return "1.1";
    if (/redis|stateless|pub\/sub|fanout|admin|live-player/i.test(n)) return "1.2";
    if (/operations|hardening|runbook|observability|docs portal|documentation hub|quality|debug/i.test(n))
      return "1.3";
    return "1.3";
  }

  const items = [];
  completed.forEach((title) => {
    items.push({
      id: `done-${slugify(title)}`,
      title,
      status: "done",
      feature: classifyFeature(title),
      subTasks: [],
    });
  });
  current.forEach((item) => {
    const task = typeof item === "string" ? { title: item, subTasks: [] } : item;
    items.push({
      id: `current-${slugify(task.title)}`,
      title: task.title,
      status: "in_progress",
      feature: classifyFeature(task.title),
      subTasks: task.subTasks || [],
    });
  });
  next.forEach((item) => {
    const task = typeof item === "string" ? { title: item, subTasks: [] } : item;
    items.push({
      id: `next-${slugify(task.title)}`,
      title: task.title,
      status: "new",
      feature: classifyFeature(task.title),
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
    tools: toolsSection,
    db: dbSection || "See Architecture for durability boundaries.",
    server: serverSection || "See Architecture for server responsibilities.",
    technologies: techStack,
  };
}

const planStatus = {
  feature:
    pickSingleBullet(raw.plan, "Current feature") ||
    pickSingleBullet(raw.plan, "Current Feature"),
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
const multiSubSteps = [];

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
    features: extractFeatures(raw),
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

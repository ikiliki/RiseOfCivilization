function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function normalizeTask(input) {
    if (typeof input === 'string') {
        return { title: input, subTasks: [] };
    }
    return {
        title: input.title,
        subTasks: input.subTasks ?? []
    };
}
function classifyFeature(title, currentFeature) {
    const normalized = `${title} ${currentFeature}`.toLowerCase();
    if (/operations|hardening|runbook|observability|integration test|contract test|docs portal|documentation hub|quality|debug/i.test(normalized)) {
        return '1.3';
    }
    if (/redis|stateless|pub\/sub|fanout|live-player|admin/i.test(normalized)) {
        return '1.2';
    }
    if (/multiplayer|presence|websocket|inspect|remote player/i.test(normalized)) {
        return '1.1';
    }
    if (/mvp|first playable|spawn|world|chunk|hud|settings|bootstrap|frontend|backend core/i.test(normalized)) {
        return '1';
    }
    return '1.3';
}
export function normalizeWorkItems(planStatus) {
    const currentFeature = planStatus.feature ?? planStatus.phase ?? '';
    const completed = planStatus.completed.map((title) => ({
        id: `done-${slugify(title)}`,
        title,
        status: 'done',
        feature: classifyFeature(title, currentFeature),
        subTasks: []
    }));
    const current = planStatus.current.map((item) => {
        const task = normalizeTask(item);
        return {
            id: `current-${slugify(task.title)}`,
            title: task.title,
            status: 'in_progress',
            feature: classifyFeature(task.title, currentFeature),
            subTasks: task.subTasks ?? []
        };
    });
    const next = planStatus.next.map((item) => {
        const task = normalizeTask(item);
        return {
            id: `next-${slugify(task.title)}`,
            title: task.title,
            status: 'new',
            feature: classifyFeature(task.title, currentFeature),
            subTasks: task.subTasks ?? []
        };
    });
    return [...completed, ...current, ...next];
}
export function extractRoadmapFeatures(roadmapMarkdown, currentFeature) {
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
        let status = 'planned';
        if (suffix === 'complete') {
            status = 'done';
        }
        else if (suffix === 'current' || normalizedCurrentFeature.includes(id) || normalizedCurrentFeature.includes(rawTitle.toLowerCase())) {
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
export function getFeatureOptions(items, features) {
    return [...new Set([...features.map((p) => p.title), ...items.map((item) => item.feature)])];
}
export function filterWorkItems(items, statusFilter, featureFilter) {
    return items.filter((item) => {
        const statusMatches = statusFilter === 'all' || item.status === statusFilter;
        const featureMatches = featureFilter === 'all' || item.feature === featureFilter;
        return statusMatches && featureMatches;
    });
}

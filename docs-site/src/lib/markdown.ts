export function stripDocumentTitle(markdown: string): string {
  return markdown.replace(/^# .+\n+/, '').trim();
}

export function extractListByHeading(markdown: string, heading: string): string[] {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withSentinel = `${markdown}\n## `;
  const pattern = new RegExp(`^##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=^##\\s+)`, 'm');
  const section = withSentinel.match(pattern)?.[1] ?? '';

  return [...section.matchAll(/^- (.+)$/gm)].map((match) => match[1].trim());
}

export function extractRoadmapMilestone(markdown: string, title: string): string[] {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withSentinel = `${markdown}\n### `;
  const pattern = new RegExp(`^###\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=^###\\s+)`, 'm');
  const section = withSentinel.match(pattern)?.[1] ?? '';

  return [...section.matchAll(/^- (.+)$/gm)].map((match) => match[1].trim());
}

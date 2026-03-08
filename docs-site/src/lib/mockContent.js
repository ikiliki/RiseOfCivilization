const currentTasks = Array.from({ length: 4 }, (_, index) => ({
    title: `Current hardening task ${index + 1}`,
    subTasks: [
        `Implement slice ${index + 1}.`,
        `Document verification for task ${index + 1}.`
    ]
}));
export const mockContent = {
    generatedAt: '2026-03-06T00:00:00.000Z',
    sources: {
        docsReadme: 'docs/README.md',
        mvp: 'docs/mvp/mvp-scope.md',
        design: 'docs/design/game-design-brief.md',
        architecture: 'docs/architecture/technical-architecture.md',
        diagramsDoc: 'docs/architecture/diagrams.md',
        localDev: 'docs/dev/local-development.md',
        deployment: 'docs/dev/deployment-strategy.md',
        storybook: 'docs/ui/storybook-plan.md',
        roadmap: 'docs/product/implementation-roadmap.md',
        plan: 'PLAN.md'
    },
    docs: {
        docsReadme: '# Documentation Index\n\n## Project Summary\nRise Of Civilization is in active implementation with a shared world, deterministic generation, and Feature 1.1 multiplayer foundation work.',
        mvp: '# MVP Scope\n\n## In Scope\n- Shared world login and spawn flow.\n- Deterministic chunk generation.\n- Save/load and settings persistence.',
        design: '# Design\n\n## Player Fantasy\nThe player explores a shared persistent frontier and builds familiarity through movement and discovery.',
        architecture: '# Architecture\n\n## Feature 1.1 Multiplayer (Implemented)\n- Presence sync via WebSocket.\n- Nearby player broadcast.\n- Inspect panel integration.',
        diagramsDoc: '# Diagrams\n\n## Diagram 1: Example\n```mermaid\nflowchart LR\n  A --> B\n```',
        localDev: '# Local Dev\n\n## Local Scripts and Commands\n- `pnpm dev`\n- `pnpm test`\n- `pnpm storybook`',
        deployment: '# Deployment\n\n## Solo-Friendly Baseline Path\n- Frontend static hosting.\n- Backend single service.\n- Managed PostgreSQL.',
        storybook: '# Storybook\n\n## What Belongs in Storybook\n- HUD shell\n- Settings modal\n- Inspect panel',
        roadmap: '# Roadmap\n\n### Feature 1.1: Multiplayer infra (Complete)\n- WebSocket real-time layer.\n- Nearby-player broadcast.\n- Player inspect panel.',
        plan: '# Project Plan\n\n## Current Feature\n- Feature 1.1: Multiplayer infra'
    },
    planStatus: {
        feature: 'Feature 1.3: Documentation hub',
        completed: [
            'Monorepo scaffold completed.',
            'Client runtime implemented.',
            'Feature 1.1 + 1.2 realtime foundation implemented.'
        ],
        current: currentTasks,
        next: [
            {
                title: 'Add contract tests for presence and admin APIs.',
                subTasks: ['Cover status codes and payload shape.', 'Cover remove-user behavior.']
            }
        ]
    },
    diagrams: [
        {
            title: 'Diagram 1: System Context',
            intro: 'Example system context diagram.',
            code: 'flowchart LR\n  Player --> Client\n  Client --> Server\n  Server --> Database'
        }
    ],
    multiSubSteps: [
        {
            title: '1. Presence and Nearby Sync',
            subItems: ['WebSocket lifecycle', 'Broadcast filtering', 'Remote player rendering']
        },
        {
            title: '2. Inspect Flow',
            subItems: ['Click-to-inspect', 'REST profile query', 'Panel data display']
        }
    ]
};

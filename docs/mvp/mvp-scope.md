# MVP Scope

## Purpose
Define the smallest believable playable version of Rise Of Civilization that validates core game feel and technical foundation without introducing post-MVP systems.

## Status
MVP baseline complete; still authoritative for MVP boundaries while Phase 3 operations/hardening is in progress.

## Last Updated
2026-03-06

## Related Documents
- `docs/design/game-design-brief.md`
- `docs/architecture/technical-architecture.md`
- `docs/product/implementation-roadmap.md`
- `.cursor/rules/RULES.md`

## MVP Definition
The MVP is a single-player browser experience where the player logs in, enters one shared persistent world, spawns in a discovered spawnable area, explores deterministic chunk-based terrain with visible biome transitions, and resumes from persisted state after reload.

## In Scope
- Single-player login flow (dev-friendly, no third-party OAuth).
- One shared world for all players, identified by a global world seed.
- Player spawn into deterministic seeded terrain that is generated lazily on first discovery/request.
- Top-down movement with camera follow.
- Chunk-based procedural world generation.
- Three biome foundations: grassland, desert, ice.
- Visible biome transitions (blended or stepped, but clearly readable).
- Persistence of discovered/generated chunks as shared world records.
- New-player spawn selection only from already discovered/generated spawnable chunks/tiles.
- Save/load of player position and selected settings.
- Polished HUD shell and settings modal.
- Keyboard rebinding for core movement actions.
- Backend API + PostgreSQL persistence.
- Local Docker Compose development setup.
- Storybook for reusable HUD/app UI components.

## Shared World Generation Rules (MVP)
- There is exactly one shared persistent world.
- The world is not pre-generated.
- World terrain is deterministic from `worldSeed + chunk coordinates`.
- When a chunk is first requested, it is generated.
- After first generation, the chunk is recorded as discovered.
- Discovered chunks become part of persistent shared world state.

## Player Spawning Rules (MVP)
- New players spawn only in already discovered spawnable chunks/tiles.
- Spawn location is random among valid discovered spawnable locations.
- Advanced spawn logic is deferred (homes, cities, spawn zones).

## Out of Scope
- Full server-authoritative multiplayer simulation.
- Multiplayer social systems (chat, parties, guilds, matchmaking).
- Combat, damage, crafting, inventory depth, quest systems.
- NPC AI, economy, trade, settlement/civilization simulation.
- Complex weather/ecosystem simulation.
- Monetization, live ops, analytics platform, admin panel.
- Mobile-specific UX and controls.
- Full account management and production-grade auth federation.
- Advanced spawn systems (homes, towns, fixed spawn points, safe zones, faction-based spawn logic).

## First Playable Criteria
A build is first playable when all are true:
- Developer starts full stack locally using documented commands.
- User logs in and enters the world.
- Player can move continuously through streamed chunks.
- Newly discovered chunks are generated deterministically and persisted as shared world state.
- New players spawn in valid discovered/generated areas (not unexplored void).
- Grass/desert/ice regions are visibly distinct and transition plausibly.
- Settings modal opens from HUD and persists changes.
- Keybinds can be changed and are active immediately.
- Reloading restores player position and settings from persistence.

## What Can Be Mocked Safely
- Identity bootstrap details (simple username/token bootstrap instead of full auth stack).
- Non-critical player profile fields (avatar, progression labels, cosmetic stats).
- HUD values not driving gameplay (currency placeholder, non-functional status widgets).
- Biome decoration assets (placeholder meshes/textures/materials).
- Sound/music pipeline (optional placeholders or disabled).

## What Must Be Real Now
- Real shared global world seed + deterministic chunk generation behavior.
- Real lazy generation on first discovery/request of unexplored chunks.
- Real persistence for discovered/generated chunks in shared world state.
- Real spawn validation so new players spawn only in discovered/generated spawnable areas.
- Real chunk load/unload logic tied to player position.
- Real movement loop and camera behavior.
- Real save/load API contract and PostgreSQL persistence.
- Real settings and keybinding persistence path.
- Real separation between 3D world rendering and UI shell.
- Real local Dockerized workflow for repeatable development.

## Spawn Rule (MVP and Deferred)
- MVP rule: new-player spawn can be random among valid discovered/generated spawnable locations.
- Deferred: advanced spawn systems (homes, towns, spawn points, safe zones, faction-based rules).

## Acceptance Gate
Do not start post-MVP systems until:
- First playable criteria are met,
- MVP performance is acceptable on a typical dev machine,
- Core docs remain aligned with implementation decisions.

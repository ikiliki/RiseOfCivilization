# Game Design Brief (MVP)

## Purpose
Define the player-facing experience and UX priorities for first playable, aligned to MVP boundaries and shared-world architecture.

## Status
Active design baseline for MVP.

## Last Updated
2026-03-06

## Related Documents
- `docs/mvp/mvp-scope.md`
- `docs/architecture/technical-architecture.md`
- `docs/ui/storybook-plan.md`
- `docs/product/implementation-roadmap.md`

## Player Fantasy
The player is a lone explorer entering a large persistent frontier. The immediate fantasy is orientation, movement mastery, and discovery of biome boundaries, not conquest or deep simulation.

## MVP Gameplay Loop
1. Enter game through simple login.
2. Enter the shared persistent world and spawn at last saved location or a valid discovered spawn location.
3. Move and explore nearby terrain.
4. Trigger lazy generation when reaching unexplored chunk boundaries.
5. Notice biome shifts (grassland -> desert -> ice or vice versa).
6. Persist newly discovered chunks and current player state.
7. Open HUD/settings, adjust controls or options.
8. Exit/reload and continue from saved position/settings in the same shared world.

The loop should feel stable and repeatable even with placeholder assets.

## Main Screens
- Login Screen: minimal entry point with clear "Start" action.
- Loading/Spawn Transition: short transition while session, spawn eligibility, and nearby chunks initialize.
- In-Game Screen: full canvas + HUD overlay shell.
- Settings Modal: opened from HUD; includes keybindings and base options.
- Optional Pause Overlay: lightweight panel for save/return actions.

## Shared World Gameplay Implications
- Players do not enter a fresh private map; they enter one shared world state.
- The shared world is not pre-generated; it is discovered over time.
- Exploration has continuity because discovered/generated chunks persist in storage.
- Early playtesting should validate that revisiting explored areas is stable and deterministic.
- Feature 1.1: Multiple players can connect to the same world, see each other, and inspect profiles.

## Feature 1.1 Multiplayer UX
- Players appear in the world as colored avatars (local: white, others: blue).
- Hover over another player shows pointer cursor; click opens inspect panel.
- Inspect panel shows: username, ID, currency, stats, location/biome.
- No chat, combat, or trading; focus on presence and inspection only.

## Shared World Generation Rules (MVP)
- One shared world exists for all players.
- World seed + chunk coordinates determine terrain.
- Chunks are generated lazily only when first requested/visited.
- First-time generated chunks are recorded as discovered shared-world records.
- Re-entering discovered areas should return persistent shared-world results.

## HUD Direction
- Visual tone: clean, game-like, layered overlays, not a generic web dashboard.
- Keep HUD lightweight in MVP: top bar + utility corner + modal triggers.
- Prioritize readability over ornamental complexity.
- Reserve screen center for world visibility; avoid intrusive panels by default.

## Settings and Keybinding UX Expectations
- Settings modal opens/closes quickly without breaking simulation.
- Keybinding UI supports:
  - selecting an action,
  - capturing a replacement key,
  - conflict feedback (duplicate binding warning),
  - reset-to-default.
- Settings apply immediately where possible and persist explicitly on save/apply.
- Failed save should show clear feedback and preserve local edits.

## Biome and World Feel (Early Implementation)
- Biomes must be distinguishable at a glance via color palette and material behavior.
- Terrain language:
  - Grassland: temperate, medium saturation, softer contrast.
  - Desert: warm hue shift, sparse detail, lighter roughness profile.
  - Ice: cool tones, higher brightness/contrast, crisp visual identity.
- Biome transitions should avoid harsh random patches; use noise blending and edge smoothing where practical.
- Newly discovered terrain should feel coherent with already discovered neighbors (no visible seam resets).

## New Player Spawn Rule (MVP)
- New players must spawn only in already discovered/generated spawnable chunks/tiles.
- Temporary rule for MVP: choose a random spawn from valid discovered spawnable locations.
- If no valid discovered spawn exists yet, use a bootstrap discovered starter chunk path controlled by server setup.

## Spawn System Upgrade Path (Deferred)
- Future systems can replace random discovered spawn with:
  - home-based spawn,
  - town/hub spawn,
  - explicit spawn-point ownership,
  - safe-zone constrained spawn,
  - faction-based spawn routing.
- Current MVP UX should not hard-code assumptions that block this replacement.

## Placeholder Asset Strategy
- Use simple geometric primitives and low-cost materials first.
- Keep biome identity in shader/material/texture choices, not asset complexity.
- Use temporary iconography and panel art for HUD where needed.
- Track placeholders explicitly so replacement work is scoped later.

## What Not to Design Yet
- Combat loop, enemy archetypes, progression trees.
- Settlement construction interfaces.
- Inventory/crafting UX depth.
- Quest narrative systems.
- Multiplayer social UX and networking assumptions.
- Advanced spawn policy UI and governance.

Design effort now should serve first playable, not future feature speculation.

# Architecture Diagrams

## Purpose
Provide extraction-friendly Mermaid diagrams for architecture communication and future HTML portal rendering.

## Status
Active.

## Last Updated
2026-03-06

## Related Documents
- `docs/architecture/technical-architecture.md`
- `docs/mvp/mvp-scope.md`
- `docs/product/implementation-roadmap.md`

## Diagram Index
- [Diagram 1: System Context](#diagram-1-system-context)
- [Diagram 9: Feature 1.1 Multiplayer Flow](#diagram-9-feature-11-multiplayer-flow)
- [Diagram 10: Stateless Realtime with Redis](#diagram-10-stateless-realtime-with-redis)
- [Diagram 2: Monorepo Architecture](#diagram-2-monorepo-architecture)
- [Diagram 3: Client Runtime Flow](#diagram-3-client-runtime-flow)
- [Diagram 4: World Generation Pipeline](#diagram-4-world-generation-pipeline)
- [Diagram 5: Chunk Streaming Logic](#diagram-5-chunk-streaming-logic)
- [Diagram 6: Login and Player Spawn Flow](#diagram-6-login-and-player-spawn-flow)
- [Diagram 7: Shared World Chunk Lifecycle](#diagram-7-shared-world-chunk-lifecycle)
- [Diagram 8: Multiplayer Evolution Path](#diagram-8-multiplayer-evolution-path)

## Diagram 1: System Context
This diagram shows the MVP runtime boundary from player interaction to persistent storage.

- Explains client-server-database relationship.
- Emphasizes persistence as part of core loop.

```mermaid
flowchart LR
  Player[Player] --> Client[Client App]
  Client --> Server[Backend API]
  Server --> Database[(PostgreSQL)]
```

## Diagram 9: Feature 1.1 Multiplayer Flow
This diagram shows the WebSocket presence and position sync flow added in Feature 1.1.

- Clients connect to `/ws?token=...` after REST bootstrap.
- Position updates are broadcast only to nearby players (chunk-radius based).

```mermaid
flowchart TB
  subgraph Clients
    C1[Client A]
    C2[Client B]
  end

  subgraph Server
    WS[WebSocket /ws]
    Presence[In-Memory Presence]
    API[REST API]
  end

  C1 -->|Connect + position_update| WS
  C2 -->|Connect + position_update| WS
  WS --> Presence
  Presence -->|Broadcast nearby| C1
  Presence -->|Broadcast nearby| C2
  C1 -->|inspect profile| API
```

## Diagram 10: Stateless Realtime with Redis
This diagram shows the Feature 1.2 target topology for multi-instance WebSocket/API servers.

- Gateway instances stay stateless and coordinate presence through Redis.
- PostgreSQL remains the durable store; Redis carries ephemeral realtime state and events.

```mermaid
flowchart LR
  subgraph Clients
    C1[Client A]
    C2[Client B]
  end

  subgraph Gateway["Stateless Gateway Instances"]
    GW1[WS/API Instance 1]
    GW2[WS/API Instance 2]
  end

  subgraph Redis["Redis Realtime Layer"]
    KV[(Presence Keys + TTL)]
    PS[[Pub/Sub Channels]]
    IDX[(Server Live Player Index)]
  end

  PG[(PostgreSQL Durable Store)]

  C1 -->|/ws + /api| GW1
  C2 -->|/ws + /api| GW2

  GW1 <--> KV
  GW2 <--> KV
  GW1 <--> PS
  GW2 <--> PS
  GW1 <--> IDX
  GW2 <--> IDX

  GW1 -->|save/load, world data| PG
  GW2 -->|save/load, world data| PG

  GW1 -->|GET live players per server| IDX
  GW2 -->|GET live players per server| IDX
```

## Diagram 2: Monorepo Architecture
This diagram shows planned package and application boundaries in the monorepo.

- Highlights reuse of shared packages.
- Separates app runtime from shared logic.

```mermaid
flowchart TB
  subgraph Apps
    ClientApp[apps/client]
    ServerApp[apps/server]
  end

  subgraph Packages
    WorldEngine[packages/world-engine]
    UiPkg[packages/ui]
    SharedTypes[packages/shared-types]
  end

  ClientApp --> WorldEngine
  ClientApp --> UiPkg
  ClientApp --> SharedTypes
  ServerApp --> WorldEngine
  ServerApp --> SharedTypes
```

## Diagram 3: Client Runtime Flow
This diagram shows how input and chunk logic flow into rendering and HUD output.

- Clarifies gameplay loop at client runtime level.
- Separates world rendering from UI shell output.

```mermaid
flowchart LR
  Input[Player Input] --> Movement[Movement Controller]
  Movement --> ChunkManager[Chunk Manager]
  ChunkManager --> WorldGenerator[World Engine]
  WorldGenerator --> Renderer[3D Renderer]
  Renderer --> HUD[HUD Layer]
```

## Diagram 4: World Generation Pipeline
This diagram shows deterministic terrain generation from seed and coordinates.

- Makes deterministic pipeline explicit.
- Connects biome selection to final chunk output.

```mermaid
flowchart LR
  Seed[World Seed + Coordinates] --> Noise[Noise Sampling]
  Noise --> Biome[Biome Assignment]
  Biome --> Terrain[Terrain Synthesis]
  Terrain --> Chunk[Generated Chunk]
```

## Diagram 5: Chunk Streaming Logic
This diagram shows how movement triggers chunk load, generation checks, and unload decisions.

- Captures active chunk radius behavior.
- Shows load and unload in one runtime path.

```mermaid
flowchart LR
  Position[Player Position] --> ChunkCalc[Active Chunk Set]
  ChunkCalc --> LoadCheck[Need Load?]
  LoadCheck --> RenderQueue[Render Queue]
  ChunkCalc --> UnloadCheck[Need Unload?]
  UnloadCheck --> CacheOrDrop[Cache or Release]
```

## Diagram 6: Login and Player Spawn Flow
This diagram shows MVP login and spawn selection using discovered spawnable locations.

- Confirms spawn validation happens before gameplay.
- Shows bootstrap fallback for empty discovered sets.

```mermaid
flowchart LR
  Login[Login Request] --> LoadPlayer[Load Player State]
  LoadPlayer --> SpawnQuery[Query Discovered Spawnables]
  SpawnQuery --> SpawnSelect[Select Valid Spawn]
  SpawnSelect --> SpawnPlayer[Spawn in Shared World]
```

## Diagram 7: Shared World Chunk Lifecycle
This diagram shows lazy generation and persistence for requested chunks.

- Distinguishes existing chunk load versus first generation.
- Shows discovery persistence as mandatory step.

```mermaid
flowchart LR
  Request[Chunk Request] --> Exists{Discovered Record Exists?}
  Exists -->|Yes| Load[Load Persisted Chunk]
  Exists -->|No| Generate[Generate Deterministic Chunk]
  Generate --> Persist[Persist as Discovered]
  Persist --> Load
```

## Diagram 8: Multiplayer Evolution Path
This diagram shows the intended path from MVP single-player runtime to future multiplayer authority.

- Feature 1.1 implements presence sync and inspect; authority remains client-side for movement.
- Preserves upgrade sequence from shared-world foundation.

```mermaid
flowchart LR
  MVP[MVP Single-Player Runtime] --> SharedWorld[Shared Persistent World Baseline]
  SharedWorld --> Presence[Feature 1.1: Presence + Inspect]
  Presence --> Authority[Server Authority Introduction]
  Authority --> Multiplayer[Full Multiplayer Synchronization]
```

## Export Notes
- Mermaid Live Editor: [https://mermaid.live](https://mermaid.live)
- Markdown renderers that support Mermaid can directly display this file.

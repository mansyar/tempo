# PRD: Tempo — Scrum Tools for Modern Teams

> **Status:** Active · **Version:** 2.0 · **Last Updated:** 2026-04-21

---

## 1. Product Overview

**Tempo** is a lightweight, real-time scrum ceremony toolkit for modern agile teams. Born from a focused planning poker tool, Tempo expands to cover the key ceremonies of the sprint lifecycle — all sharing the same "zero-friction" philosophy: **no accounts, no setup, instant collaboration.**

Tempo is not a project management tool. It doesn't replace Jira, Linear, or Notion. Instead, it's the **companion tool you open during ceremonies** — the dedicated "second screen" that makes standups, estimation, and retrospectives faster and more engaging.

### Product Identity

| Attribute            | Value                                       |
| -------------------- | ------------------------------------------- |
| **Name**             | Tempo                                       |
| **Tagline**          | Scrum Tools for Modern Teams                |
| **Previous Name**    | Pointy Planning Poker                       |
| **Visual Direction** | "Modern Corporate" — Linear/Vercel-inspired |
| **Rebranding Doc**   | [REBRANDING.md](./REBRANDING.md)            |

## 2. Target User & Use Case

- **Target:** Remote/Hybrid Agile teams (Scrum Masters, Developers, Product Owners).
- **Context:** Used as a dedicated "second screen" or browser tab during sprint ceremonies.
- **Team Size:** Optimized for 3–15 participants per room.
- **Frequency:** Daily (standups), bi-weekly (planning, retros).

## 3. Core Philosophy

These principles apply across **all** Tempo tools:

| Principle                | Description                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **No accounts**          | Users enter with a nickname only. A `localStorage`-based `identityId` provides session persistence without authentication overhead. |
| **Ephemeral by default** | All rooms and data auto-delete after 24 hours of inactivity. Tempo is not a database — it's a live ceremony companion.              |
| **Real-time first**      | Every interaction syncs across all participants in <150ms via Convex subscriptions. No polling, no refresh.                         |
| **Facilitator model**    | Every room has one facilitator (first to join or claim). They control the ceremony flow. Others participate.                        |
| **Ceremony-scoped**      | Each tool covers exactly one scrum ceremony. No feature creep into project management territory.                                    |

## 4. Module Overview

Tempo is organized as a collection of **modules**, each covering a specific scrum ceremony. Modules share common infrastructure (rooms, players, presence, reactions) but have independent UI and data models.

| Module                    | Ceremony                   | Status         | PRD                                |
| ------------------------- | -------------------------- | -------------- | ---------------------------------- |
| 🃏 **Planning Poker**     | Sprint Planning / Grooming | ✅ Shipped     | [PRD_POKER.md](./PRD_POKER.md)     |
| ⏱ **Daily Standup Timer** | Daily Standup              | 📋 Coming Soon | [PRD_STANDUP.md](./PRD_STANDUP.md) |
| 💬 Sprint Retrospective   | Sprint Retro               | 🔮 Future      | —                                  |
| 📈 Velocity Dashboard     | Sprint Review              | 🔮 Future      | —                                  |

## 5. Tech Stack & Architecture

### 5.1 Stack

| Layer          | Technology                                               | Rationale                                              |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------ |
| **Framework**  | TanStack Start (Latest)                                  | SSR, type-safe routing, Vite-based bundling            |
| **Backend**    | Convex                                                   | Real-time document store, mutations, cron jobs         |
| **Styling**    | Tailwind CSS v4                                          | Utility-first, great DX, composable glassmorphism      |
| **Animation**  | Framer Motion                                            | 3D transforms, spring physics, layout animations       |
| **State**      | TanStack Search Params + `localStorage`                  | URL-shareable state + session persistence without auth |
| **PWA**        | Web Manifest + Service Workers                           | Standalone mobile experience                           |
| **Deployment** | Private VPS + Coolify (frontend), Convex Cloud (backend) | Self-hosted, Docker-based                              |

### 5.2 Multi-Tool Architecture

All modules share a **polymorphic room** model. The `rooms` table holds shared state while tool-specific data lives in separate tables.

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED INFRASTRUCTURE                     │
│  rooms · players · reactions · sync_tokens · cleanup cron   │
├──────────────┬──────────────────┬───────────────────────────┤
│  🃏 POKER    │  ⏱ STANDUP       │  💬 RETRO (future)       │
│  votes       │  standup_entries  │  retro_columns            │
│  topics      │  parking_lot     │  retro_cards              │
│              │                  │  retro_dot_votes           │
└──────────────┴──────────────────┴───────────────────────────┘
```

### 5.3 The Room Abstraction

Every Tempo module operates inside a **room** — a real-time, ephemeral collaboration space. Rooms are polymorphic: the `toolType` field determines which module runs inside the room.

```typescript
// Shared room fields (all modules)
rooms: {
  slug: string,           // human-readable identifier
  toolType: 'poker' | 'standup',  // which module
  status: string,         // Tool-specific statuses
                            // Poker: 'voting' | 'revealed'
                            // Standup: 'setup' | 'in_progress' | 'paused' | 'complete'
  facilitatorId: string,  // identityId of current facilitator
  config: object,         // tool-specific settings
  updatedAt: number,      // for 24h auto-cleanup
}
```

**What every room gets for free:**

- Player join/leave with presence detection
- Facilitator assignment and claiming
- Real-time emoji reactions
- Cross-device sync tokens
- Auto-cleanup after 24h inactivity

## 6. Route Structure

| Route          | Module         | Description                                                   |
| -------------- | -------------- | ------------------------------------------------------------- |
| `/`            | —              | Landing hub — tool selector with nickname entry and join form |
| `/poker/:slug` | Planning Poker | Poker room (estimation session)                               |
| `/room/:slug`  | —              | Legacy redirect → `/poker/:slug` (backward compat)            |

> **Note:** `/standup/:slug` route will be added when the Daily Standup module is implemented (planned for v2.1).

## 7. Landing Page (Hub)

The landing page transforms from a single-tool entry point into a **tool selector hub**:

```
┌──────────────────────────────────────────────────────────────────┐
│  ◈ Tempo                                         [☀/🌙]        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│               Scrum Tools for Modern Teams                       │
│                                                                  │
│          Real-time ceremonies. No accounts.                      │
│          No friction. Just go.                                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Your nickname: [___________________]                    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  CHOOSE A TOOL:                                                  │
│                                                                  │
│  ┌─────────────────────┐       ┌─────────────────────┐          │
│  │   ♠  Planning       │       │   ⏱  Daily          │          │
│  │      Poker          │       │     Standup          │          │
│  │                     │       │                     │          │
│  │  Estimate stories   │       │  COMING SOON        │          │
│  │  as a team          │       │                     │          │
│  │                     │       │  (v2.1)             │          │
│  │  [🚀 Create Room]  │       │  [⏳ Not avail.]    │          │
│  └─────────────────────┘       └─────────────────────┘          │
│                                                                  │
│  ─── or join an existing room ───                                │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Paste room link or code...               [→ Join]       │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  Built with TanStack Start + Convex                 © 2026 Tempo│
└──────────────────────────────────────────────────────────────────┘
```

## 8. Shared Data Schema (Convex)

These tables are used by **all** modules:

### `rooms`

| Field            | Type                                                | Notes                                         |
| ---------------- | --------------------------------------------------- | --------------------------------------------- |
| `slug`           | `v.string()`                                        | Unique index, human-readable                  |
| `toolType`       | `v.union(v.literal('poker'), v.literal('standup'))` | Which module runs in this room                |
| `status`         | `v.string()`                                        | Tool-specific statuses                        |
| `facilitatorId`  | `v.string()`                                        | `identityId` of current facilitator           |
| `currentTopicId` | `v.optional(v.id('topics'))`                        | Active item (poker-specific, kept for compat) |
| `config`         | `v.optional(v.any())`                               | Tool-specific settings                        |
| `updatedAt`      | `v.number()`                                        | Unix timestamp for auto-cleanup               |

### `players`

| Field           | Type            | Notes                               |
| --------------- | --------------- | ----------------------------------- |
| `roomId`        | `v.id('rooms')` | Foreign key                         |
| `identityId`    | `v.string()`    | Unique per browser (`localStorage`) |
| `name`          | `v.string()`    | Display nickname                    |
| `isOnline`      | `v.boolean()`   | Presence status                     |
| `lastHeartbeat` | `v.number()`    | Unix timestamp of last ping         |

### `reactions`

| Field        | Type            | Notes                              |
| ------------ | --------------- | ---------------------------------- |
| `roomId`     | `v.id('rooms')` | Foreign key                        |
| `identityId` | `v.string()`    | Sender                             |
| `emoji`      | `v.string()`    | One of: ❤️ 👏 🔥 😂 🎉             |
| `createdAt`  | `v.number()`    | Auto-expire after 5s (client-side) |

### `sync_tokens`

| Field        | Type          | Notes                           |
| ------------ | ------------- | ------------------------------- |
| `token`      | `v.string()`  | Unique sync token               |
| `identityId` | `v.string()`  | Owner identity                  |
| `expiresAt`  | `v.number()`  | Expiration timestamp            |
| `isUsed`     | `v.boolean()` | Whether token has been consumed |

### Shared Indexes

```
rooms:       by_slug(slug), by_updated(updatedAt), by_tool(toolType)
players:     by_room(roomId), by_identity(roomId, identityId), by_online(isOnline)
reactions:   by_room(roomId), by_room_and_time(roomId, createdAt)
sync_tokens: by_token(token)
```

> Module-specific schemas are documented in each module's PRD.

## 9. Shared API Contract (Convex)

### Shared Queries

| Function               | Args     | Returns                     | Notes                                                |
| ---------------------- | -------- | --------------------------- | ---------------------------------------------------- |
| `rooms.getBySlug`      | `slug`   | Room doc or null            | Used by route loader, returns `toolType` for routing |
| `players.listByRoom`   | `roomId` | Player[] with online status | Powers presence sidebar                              |
| `reactions.listRecent` | `roomId` | Reaction[] (last 5 seconds) | Powers emoji rain                                    |

### Shared Mutations

| Function                   | Args                                     | Notes                                     |
| -------------------------- | ---------------------------------------- | ----------------------------------------- |
| `rooms.create`             | `slug, facilitatorId, toolType, config?` | Creates room with specified tool type     |
| `players.join`             | `roomId, identityId, name`               | Upsert player into room                   |
| `players.heartbeat`        | `roomId, identityId`                     | Updates `lastHeartbeat` and `isOnline`    |
| `players.leave`            | `roomId, identityId`                     | Sets `isOnline = false`                   |
| `players.claimFacilitator` | `roomId, identityId`                     | Claim facilitator when current is offline |
| `reactions.send`           | `roomId, identityId, emoji`              | Broadcast emoji reaction                  |

### Shared Cron Jobs

| Function                 | Schedule         | Notes                                                             |
| ------------------------ | ---------------- | ----------------------------------------------------------------- |
| `cleanup.staleRooms`     | Every 1 hour     | Delete rooms where `updatedAt` > 24h ago (cascades all tool data) |
| `cleanup.offlinePlayers` | Every 30 seconds | Mark players offline where `lastHeartbeat` > 30s ago              |

## 10. Non-Functional Requirements

| Requirement                | Target                                          |
| -------------------------- | ----------------------------------------------- |
| **First Contentful Paint** | < 500ms                                         |
| **Real-time Sync Latency** | < 150ms globally                                |
| **Max Room Size**          | 15 concurrent participants                      |
| **Data Retention**         | 24 hours (ephemeral)                            |
| **Bundle Size**            | < 200KB gzipped (initial load)                  |
| **Type Safety**            | 100% end-to-end TypeScript from DB to component |
| **Browser Support**        | Chrome, Firefox, Safari, Edge (last 2 versions) |
| **Accessibility**          | WCAG 2.1 AA compliant                           |

## 11. Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for the complete visual specification including:

- Color palette (dark/light mode)
- Typography scale
- Spacing, radius, shadow tokens
- Component inventory
- Animation tokens
- Wireframes and interaction states

## 12. Document Map

| Document                               | Scope         | Description                                                      |
| -------------------------------------- | ------------- | ---------------------------------------------------------------- |
| **This file** (`PRD.md`)               | Product-level | Umbrella vision, shared architecture, shared APIs                |
| [PRD_POKER.md](./PRD_POKER.md)         | Module        | Planning Poker feature spec, poker-specific schema & APIs        |
| [PRD_STANDUP.md](./PRD_STANDUP.md)     | Module        | Daily Standup Timer feature spec, standup-specific schema & APIs |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Product-level | Visual tokens, components, wireframes                            |
| [REBRANDING.md](./REBRANDING.md)       | Reference     | Rebrand rationale, scope, and migration guide                    |

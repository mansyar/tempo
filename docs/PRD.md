# PRD: "Pointy" – Real-Time Ephemeral Planning Poker

> **Status:** Development-Ready · **Version:** 1.0 · **Last Updated:** 2026-04-18

---

## 1. Product Overview

**Pointy** is a high-performance, real-time estimation tool for agile teams. Designed for a "zero-friction" workflow, it requires no accounts or long-term data storage. It leverages **TanStack Start** for sophisticated routing and **Convex** for live-syncing, resulting in a "gaming-grade" UI for professional sprint planning.

## 2. Target User & Use Case

- **Target:** Remote/Hybrid Agile teams (Scrum Masters, Devs, POs).
- **Context:** Used during Sprint Planning or Backlog Grooming as a dedicated "second screen" or browser tab.
- **Team Size:** Optimized for 3–15 participants per room.

## 3. Tech Stack & Architecture

| Layer          | Technology                                                      | Rationale                                                           |
| -------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Framework**  | TanStack Start (Beta/Latest)                                    | SSR, type-safe routing, Vinxi/Vite-based bundling                   |
| **Backend**    | Convex                                                          | Real-time document store, mutations, scheduled functions, cron jobs |
| **Styling**    | Tailwind CSS v4                                                 | Utility-first, great DX with Vite, composable glassmorphism         |
| **State**      | TanStack Search Params (UI) + `localStorage` (Session Identity) | URL-shareable state + persistence without auth                      |
| **Animation**  | Framer Motion                                                   | 3D transforms, spring physics, layout animations                    |
| **PWA**        | Web Manifest + Service Workers                                  | Standalone mobile "controller" experience                           |
| **Deployment** | Private VPS + Coolify                                           | Self-hosted, full control, Docker-based deployment                  |

## 4. Functional Requirements

### A. Room & Identity (The "No-Auth" System)

- **Anonymous Entry:** Users enter a nickname to join; no email/password required.
- **Persistent Session:** A unique `identityId` is stored in `localStorage` to maintain "Player" status through refreshes.
- **Human-Readable Slugs:** Rooms use unique slugs (e.g., `/room/clumsy-tiger-22`) for easy sharing.
- **Facilitator Role:** The first player to join becomes the Facilitator. They control the game state (Reveal/Reset/Next Topic). If they leave, the "Claim Facilitator" option appears for others.
- **Room Access:** Fully open — anyone with the URL can join. Slugs are pseudo-private (hard to guess).
- **Auto-Cleanup:** Convex cron jobs delete rooms, players, votes, and topics after **24 hours** of inactivity.

### B. Topic Queue (Estimation Items)

The Facilitator manages a queue of items to be estimated:

- **Add Topics:** Facilitator can type and add topic titles one by one, or paste multiple (one per line).
- **Topic States:** `pending` → `active` → `completed`.
- **Navigation:** "Next Topic" button advances to the next pending topic, automatically resetting votes.
- **Current Topic Display:** The active topic title is displayed prominently above the voting table.
- **Results Tracking:** Each completed topic retains its final consensus/average estimate.
- **Reorder & Delete:** Facilitator can reorder pending topics (drag or up/down) and delete them.
- **Edit:** Facilitator can inline-edit topic titles.
- **Empty State:** If no topics are added, the room functions as a simple "vote on nothing" mode (topic display shows "Free Vote").

### C. Gameplay & Real-Time Mechanics

- **Presence System (Combined):**
  - `beforeunload` event for instant disconnect detection.
  - Heartbeat ping every **10 seconds** via Convex mutation; player marked offline after **30 seconds** without a ping.
  - Live sidebar showing online status and "Voted" / "Waiting" indicators.
- **The Mask:** Individual vote values are hidden on the server until the Facilitator triggers the `revealed` state. The query returns `null` for unrevealed votes of other players.
- **Estimation Scale:** Fixed Fibonacci: `0, 1, 2, 3, 5, 8, 13, 21, ?, ☕`
- **Emoji Reactions:** Users can send floating emojis (❤️, 👏, 🔥, 😂, 🎉) that stream across the screen in real-time. Reactions auto-expire after **5 seconds**.

### D. Results & Statistics Panel

After the Facilitator triggers **Reveal**, the stats panel displays:

- **Individual Votes:** Each player's card shown face-up with their name.
- **Average:** Mean of numeric votes (excluding `?` and `☕`).
- **Median:** Middle value of numeric votes.
- **Mode:** Most common numeric vote.
- **Consensus Indicator:** Badge showing agreement level:
  - 🟢 **Unanimous** — all numeric votes identical → triggers confetti.
  - 🟡 **Near Consensus** — spread ≤ 2 points.
  - 🔴 **Split** — spread > 2 points → highlights outlier(s).
- **Outlier Highlighting:** Players with votes furthest from the median are visually highlighted and called out to explain their reasoning.

## 5. UI/UX & Design (The "Juice")

### Visual Vibe

"Modern Corporate" (Linear-style). Clean typography, deep shadows, and subtle glassmorphism (`backdrop-blur`).

### Theme

- **Dark/Light Toggle** with system-preference auto-detection as default.
- Toggle persisted in `localStorage`.
- PWA `theme_color` meta tag updated dynamically on toggle.

### Card Animations

- **Hover:** 3D tilt effect on card selection (perspective transform).
- **Select:** Scale-up + glow + haptic pulse.
- **The Reveal:** Staggered Y-axis flip (3D) with spring physics (`stiffness: 260, damping: 20`).

### Celebration

- **Confetti:** Subtle particle burst on "Unanimous" votes.
- **Emoji Rain:** Floating emoji reactions from other players stream upward and fade.

### Sensory Feedback (Unified Toggle)

- A single "Feedback" toggle in settings controlling both:
  - **Haptic:** Short vibration on card selection (PWA / mobile).
  - **Sound Effects:** Card flip, reveal whoosh, confetti pop, emoji ping.
- Default: **On**. Persisted in `localStorage`.

### Responsive Layout Strategy

| Viewport              | Layout                   | Description                                                                               |
| --------------------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| **Desktop** (≥1024px) | **Table View**           | Poker table in center, player avatars around it, topic queue sidebar, stats panel overlay |
| **Mobile** (<1024px)  | **Card Deck Controller** | Full-screen card fan at bottom, current topic at top, swipe to vote, compact player list  |

## 6. PWA Requirements

- **Display Mode:** `standalone` (removes browser URL bar when installed).
- **Theme Integration:** Meta `theme_color` synced with Dark/Light mode dynamically.
- **Performance:** Loaders must ensure the "Table" shell is visible in <500ms.
- **Offline:** Graceful offline state — show "Reconnecting..." overlay, buffer actions.

## 7. Data Schema (Convex)

### `rooms`

| Field            | Type                                                  | Notes                                 |
| ---------------- | ----------------------------------------------------- | ------------------------------------- |
| `slug`           | `v.string()`                                          | Unique index, human-readable          |
| `status`         | `v.union(v.literal("voting"), v.literal("revealed"))` | Current round state                   |
| `facilitatorId`  | `v.string()`                                          | `identityId` of current facilitator   |
| `currentTopicId` | `v.optional(v.id("topics"))`                          | Active topic being estimated          |
| `updatedAt`      | `v.number()`                                          | Unix timestamp, used for auto-cleanup |

### `players`

| Field           | Type            | Notes                                    |
| --------------- | --------------- | ---------------------------------------- |
| `roomId`        | `v.id("rooms")` | Foreign key                              |
| `identityId`    | `v.string()`    | Unique per browser (from `localStorage`) |
| `name`          | `v.string()`    | Display nickname                         |
| `isOnline`      | `v.boolean()`   | Presence status                          |
| `lastHeartbeat` | `v.number()`    | Unix timestamp of last ping              |

### `votes`

| Field        | Type                                        | Notes                                           |
| ------------ | ------------------------------------------- | ----------------------------------------------- |
| `roomId`     | `v.id("rooms")`                             | Foreign key                                     |
| `topicId`    | `v.optional(v.id("topics"))`                | Links vote to specific topic (null = free vote) |
| `identityId` | `v.string()`                                | Voter identity                                  |
| `value`      | `v.union(v.string(), v.number(), v.null())` | The estimate value                              |

### `topics`

| Field           | Type                                                                         | Notes                            |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------- |
| `roomId`        | `v.id("rooms")`                                                              | Foreign key                      |
| `title`         | `v.string()`                                                                 | Topic description                |
| `order`         | `v.number()`                                                                 | Sort position in queue           |
| `status`        | `v.union(v.literal("pending"), v.literal("active"), v.literal("completed"))` | Workflow state                   |
| `finalEstimate` | `v.optional(v.string())`                                                     | Saved consensus after completion |

### `reactions`

| Field        | Type            | Notes                              |
| ------------ | --------------- | ---------------------------------- |
| `roomId`     | `v.id("rooms")` | Foreign key                        |
| `identityId` | `v.string()`    | Sender                             |
| `emoji`      | `v.string()`    | One of: ❤️ 👏 🔥 😂 🎉             |
| `createdAt`  | `v.number()`    | Auto-expire after 5s (client-side) |

### Indexes

```
rooms:       by_slug(slug)
players:     by_room(roomId), by_identity(roomId, identityId)
votes:       by_room(roomId), by_topic(topicId), by_voter(roomId, identityId, topicId)
topics:      by_room(roomId), by_status(roomId, status)
reactions:   by_room(roomId)
```

## 8. Route Inventory

| Route         | Page        | Description                                               |
| ------------- | ----------- | --------------------------------------------------------- |
| `/`           | Landing     | Hero section, "Create Room" CTA, brief feature highlights |
| `/room/:slug` | Room (Game) | Main poker table, topic queue, voting interface, stats    |

> Only 2 routes — intentionally minimal. All room state is managed via Convex real-time subscriptions.

## 9. Convex API Contract

### Queries (Real-time subscriptions)

| Function               | Args                 | Returns                         | Notes                                                                   |
| ---------------------- | -------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `rooms.getBySlug`      | `slug`               | Room doc or null                | Used by route loader                                                    |
| `players.listByRoom`   | `roomId`             | Player[] with online status     | Powers presence sidebar                                                 |
| `votes.listByRoom`     | `roomId, identityId` | Vote[] (masked if not revealed) | Returns `null` values for other players' votes when `status = "voting"` |
| `topics.listByRoom`    | `roomId`             | Topic[] sorted by order         | Powers topic queue sidebar                                              |
| `reactions.listRecent` | `roomId`             | Reaction[] (last 5 seconds)     | Powers emoji rain                                                       |

### Mutations

| Function                   | Args                                  | Notes                                                             |
| -------------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| `rooms.create`             | `slug, facilitatorId`                 | Creates room + sets creator as facilitator                        |
| `rooms.reveal`             | `roomId, identityId`                  | Facilitator-only: sets status to "revealed"                       |
| `rooms.reset`              | `roomId, identityId`                  | Facilitator-only: clears votes, sets status to "voting"           |
| `rooms.nextTopic`          | `roomId, identityId`                  | Facilitator-only: completes current topic, activates next pending |
| `players.join`             | `roomId, identityId, name`            | Upsert player into room                                           |
| `players.heartbeat`        | `roomId, identityId`                  | Updates `lastHeartbeat` and `isOnline`                            |
| `players.leave`            | `roomId, identityId`                  | Sets `isOnline = false`                                           |
| `players.claimFacilitator` | `roomId, identityId`                  | Claim facilitator when current is offline                         |
| `votes.cast`               | `roomId, topicId?, identityId, value` | Upsert vote for current round                                     |
| `topics.add`               | `roomId, title`                       | Append topic to queue                                             |
| `topics.addBatch`          | `roomId, titles[]`                    | Bulk-add topics                                                   |
| `topics.reorder`           | `roomId, topicId, newOrder`           | Move topic in queue                                               |
| `topics.update`            | `topicId, title`                      | Edit title                                                        |
| `topics.remove`            | `topicId`                             | Delete topic                                                      |
| `topics.setFinalEstimate`  | `topicId, value`                      | Save consensus estimate                                           |
| `reactions.send`           | `roomId, identityId, emoji`           | Broadcast emoji reaction                                          |

### Scheduled Functions (Cron)

| Function                 | Schedule         | Notes                                                                         |
| ------------------------ | ---------------- | ----------------------------------------------------------------------------- |
| `cleanup.staleRooms`     | Every 1 hour     | Delete rooms where `updatedAt` > 24h ago (cascades to players, votes, topics) |
| `cleanup.offlinePlayers` | Every 30 seconds | Mark players offline where `lastHeartbeat` > 30s ago                          |

## 10. Accessibility (WCAG 2.1 AA)

- **Keyboard Navigation:** All interactive elements (cards, buttons, topic list) fully operable via keyboard with visible focus indicators.
- **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text.
- **ARIA Labels:** All icons, status indicators, and interactive elements have descriptive `aria-label` attributes.
- **Screen Reader:** Vote status, topic changes, and results announced via `aria-live` regions.
- **Reduced Motion:** Respect `prefers-reduced-motion` — disable 3D flips, confetti, emoji rain. Use simple fade/opacity transitions instead.
- **Focus Management:** Focus moves logically after reveal, topic change, and modal actions.

## 11. Deployment Strategy

| Component                     | Target                         | Notes                                                       |
| ----------------------------- | ------------------------------ | ----------------------------------------------------------- |
| **Frontend (TanStack Start)** | Private VPS via Coolify        | Dockerized Node.js server, Coolify manages builds & deploys |
| **Backend (Convex)**          | Convex Cloud                   | Managed service — no self-hosting needed                    |
| **Domain**                    | Custom domain via Coolify      | SSL auto-provisioned via Let's Encrypt                      |
| **CI/CD**                     | Git push → Coolify auto-deploy | Webhook-triggered from GitHub/Gitea                         |

### Dockerfile Considerations

- Multi-stage build: `node:22-alpine` for build, `node:22-alpine` for runtime.
- `pnpm` as package manager.
- Environment variables: `CONVEX_URL` injected at build time.

## 12. Non-Functional Requirements

| Requirement                | Target                                          |
| -------------------------- | ----------------------------------------------- |
| **First Contentful Paint** | < 500ms                                         |
| **Real-time Sync Latency** | < 150ms globally                                |
| **Max Room Size**          | 15 concurrent players                           |
| **Data Retention**         | 24 hours (ephemeral)                            |
| **Bundle Size**            | < 200KB gzipped (initial load)                  |
| **Type Safety**            | 100% end-to-end TypeScript from DB to component |
| **Browser Support**        | Chrome, Firefox, Safari, Edge (last 2 versions) |

## 13. Success Metrics (Portfolio Highlights)

- **Lighthouse:** 95+ Score (SEO / Best Practices / Performance).
- **Latency:** Global real-time sync < 150ms.
- **Type-Safety:** 100% End-to-end TS coverage from DB to Component.
- **Accessibility:** WCAG 2.1 AA compliant.
- **PWA:** Installable, standalone mode, offline-resilient.

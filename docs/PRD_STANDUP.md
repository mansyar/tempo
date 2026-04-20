# PRD: Daily Standup Timer Module

> **Product:** Tempo — Scrum Tools for Modern Teams  
> **Module:** ⏱ Daily Standup Timer  
> **Status:** Coming Soon · **Version:** 0.1 · **Last Updated:** 2026-04-21

---

## 1. Product Overview

The **Daily Standup Timer** is Tempo's second module — a real-time, timeboxed standup facilitator that helps agile teams run focused daily syncs. It provides a structured speaker queue with per-person countdown timers, a parking lot for off-topic items, and a session summary — all synced in real-time across participants.

### Why This Module?

- Standups frequently overrun their timebox — a visual countdown keeps teams honest.
- Existing standup tools require accounts and complex setup — Tempo's "join with a nickname" model eliminates friction.
- Shares 80%+ of the existing infrastructure (rooms, players, presence, facilitator, reactions) — minimal new backend code required.

## 2. User Stories

| #   | As a...      | I want to...                              | So that...                                       |
| --- | ------------ | ----------------------------------------- | ------------------------------------------------ |
| S1  | Scrum Master | Create a standup room with one click      | My team can join with just a link                |
| S2  | Team member  | See who's speaking and who's next         | I can prepare my update                          |
| S3  | Scrum Master | Set a per-person time limit               | The standup stays within 15 minutes              |
| S4  | Speaker      | See my countdown timer prominently        | I know how much time I have left                 |
| S5  | Team member  | Add items to a parking lot during standup | Off-topic discussions don't derail the sync      |
| S6  | Scrum Master | Skip or reorder speakers                  | I can handle absences and late joiners           |
| S7  | Team member  | See a summary when standup ends           | I know the total time and any parking lot items  |
| S8  | Scrum Master | Auto-advance to the next speaker          | The flow is seamless without manual intervention |

## 3. Functional Requirements

### A. Room & Configuration

- **Room Creation:** Facilitator creates a standup room from the landing hub. Room gets a unique slug (e.g., `/standup/swift-falcon-17`).
- **Timer Configuration:** Facilitator can set the per-person time limit (default: 90 seconds). Configurable at room creation and adjustable mid-session.
- **Target Duration:** An optional total standup target (default: 15 minutes) shown as a running total.
- **Shared Infrastructure:** Uses the same room, player, presence, and facilitator systems as Planning Poker (see [PRD.md](./PRD.md)).

### B. Speaker Queue

- **Auto-populated:** When standup begins, all online players are added to the queue.
- **Order modes:**
  - **Sequential** (default): Alphabetical by nickname.
  - **Randomized**: Shuffled order, determined at standup start.
- **Speaker states:** `waiting` → `speaking` → `done`.
- **Late joiners:** Players who join mid-standup are appended to the end of the queue.
- **Skip/Reorder:** Facilitator can skip a speaker (marks as "skipped") or drag to reorder.
- **Current speaker:** Prominently displayed with a large countdown timer.

### C. Timer Mechanics

- **Per-person countdown:** Visual countdown with a circular progress ring that depletes as time runs out.
- **Color transitions:**
  - Green (>50% time remaining)
  - Yellow (25–50% time remaining)
  - Red (<25% time remaining, pulsing animation)
- **Overtime indicator:** When timer hits 0, it starts counting up in red with a "+" prefix (e.g., "+0:12").
- **Auto-advance (optional):** If enabled, automatically moves to the next speaker 5 seconds after the timer expires (with a visual "Moving on..." toast).
- **Manual controls:** Facilitator can pause, resume, skip to next, or go back to previous speaker.
- **Total elapsed:** A running clock tracking total standup duration, displayed against the target.

### D. Parking Lot

- **Quick capture:** Any participant can add a text item to the parking lot during the standup.
- **Persistent within session:** Items stay visible throughout the standup and in the summary.
- **Purpose:** Captures topics that need discussion but shouldn't derail the standup timebox.
- **No assignments:** Parking lot items are just text — no assignee or status tracking (that belongs in a project management tool).

### E. Standup Flow

The standup follows a linear flow:

```
[Setup] → [In Progress] → [Complete]

Setup:        Room created, players joining, queue populating
In Progress:  Speaker-by-speaker with timer, parking lot captures
Complete:     All speakers done, summary displayed
```

**State machine:**

```
Room status values for standup:
  'setup'       → Waiting for facilitator to start
  'in_progress' → Timer running, speakers cycling
  'paused'      → Timer paused (facilitator action)
  'complete'    → All speakers done, showing summary
```

### F. Session Summary

When all speakers have finished (or the facilitator ends early):

- **Total duration:** e.g., "Standup ran 11m 42s"
- **Participant count:** e.g., "6 of 7 team members spoke"
- **Per-person times:** Each speaker's elapsed time
- **Parking lot items:** Listed for follow-up
- **Quick actions:** "Start Another" button to reset for next day

> **Note:** Summaries are ephemeral like everything else — they exist only within the room's 24h lifetime. No historical data is stored.

## 4. UI/UX Design

### 4.1 Standup Room — Desktop (≥1024px)

#### State: In Progress

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ◈ Tempo  ▸ Daily Standup  ▸ swift-falcon-17    [📋 Copy]  [⚙] [☀/🌙] │
├──────────────────────────────────────────┬───────────────────────────────┤
│                                          │                               │
│                                          │  📋 SPEAKER QUEUE             │
│           ┌───────────────────┐          │  ─────────────────────────    │
│           │                   │          │  ✓ Dave         1m 05s  done  │
│           │     01:12         │          │  ▶ Alice ★      ⏱ speaking   │
│           │                   │          │  ○ Bob          ⏳ waiting    │
│           │   ┌───────────┐   │          │  ○ Charlie      ⏳ waiting    │
│           │   │           │   │          │  ○ Eve          ⏳ waiting    │
│           │   │  ◉  75%   │   │          │  ─ Frank        — skipped    │
│           │   │           │   │          │                               │
│           │   └───────────┘   │          │                               │
│           │                   │          │  ─────────────────────────    │
│           │   Alice ★         │          │  Timer: 90s per person        │
│           │   Speaking now    │          │  Order: Randomized            │
│           │                   │          │                               │
│           └───────────────────┘          │                               │
│                                          │  🅿 PARKING LOT  [+ Add]     │
│                                          │  ─────────────────────────    │
│  Total: 3m 17s / 15m target              │  • Discuss API rate-limiting  │
│  ████████░░░░░░░░░░░░░░░  (22%)          │  • Review deploy checklist    │
│                                          │                               │
│  ┌────────────────────────────────────┐  │                               │
│  │ [⏸ Pause] [⏭ Next] [⏮ Previous]│  │  👥 ONLINE (6)                │
│  │ [⏹ End Standup]                   │  │  🟢 Alice ★  🟢 Bob          │
│  └────────────────────────────────────┘  │  🟢 Charlie  🟢 Dave         │
│                                          │  🟢 Eve      🟢 Frank        │
│  [❤️] [👏] [🔥] [😂] [🎉]              │                               │
│                                          │                               │
└──────────────────────────────────────────┴───────────────────────────────┘
```

#### State: Complete (Summary)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ◈ Tempo  ▸ Daily Standup  ▸ swift-falcon-17    [📋 Copy]  [⚙] [☀/🌙] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     ✅ Standup Complete!                                  │
│                                                                          │
│                     Total: 11m 42s                                       │
│                     5 of 6 members spoke                                 │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐        │
│  │  SPEAKER TIMES                                              │        │
│  │  ─────────────────────────────────────────────────────────  │        │
│  │  Dave ............ 1m 05s                                   │        │
│  │  Alice ★ ......... 1m 28s                                   │        │
│  │  Bob ............. 2m 11s  ⚠ over time                     │        │
│  │  Charlie ......... 0m 52s                                   │        │
│  │  Eve ............. 1m 34s                                   │        │
│  │  Frank ........... — skipped                                │        │
│  └──────────────────────────────────────────────────────────────┘        │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐        │
│  │  🅿 PARKING LOT (2 items)                                   │        │
│  │  ─────────────────────────────────────────────────────────  │        │
│  │  • Discuss API rate-limiting strategy                       │        │
│  │  • Review deploy checklist before Friday release            │        │
│  └──────────────────────────────────────────────────────────────┘        │
│                                                                          │
│  ┌─────────────────┐  ┌──────────────────────┐                          │
│  │ 🔄 Start Another │  │ 📋 Copy Summary      │                          │
│  └─────────────────┘  └──────────────────────┘                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Standup Room — Mobile (<1024px)

#### State: In Progress

```
┌──────────────────────────────┐
│  ◈ Tempo         [⚙] [☀/🌙] │
├──────────────────────────────┤
│                              │
│  ▸ Daily Standup             │
│  swift-falcon-17  [📋]      │
│                              │
│  ┌──────────────────────────┐│
│  │                          ││
│  │        01:12             ││
│  │                          ││
│  │      ┌────────┐          ││
│  │      │  ◉ 75% │          ││
│  │      └────────┘          ││
│  │                          ││
│  │      Alice ★             ││
│  │      Speaking now        ││
│  │                          ││
│  └──────────────────────────┘│
│                              │
│  Total: 3m 17s / 15m        │
│  ████████░░░░░░░░░  (22%)   │
│                              │
│  NEXT UP:                    │
│  ┌──────────────────────────┐│
│  │  ○ Bob         waiting   ││
│  │  ○ Charlie     waiting   ││
│  │  ○ Eve         waiting   ││
│  └──────────────────────────┘│
│                              │
│  🅿 Parking Lot (2)  [+]    │
│                              │
│  [⏸ Pause]  [⏭ Next]       │
│                              │
│  [❤️] [👏] [🔥] [😂] [🎉]  │
└──────────────────────────────┘
```

### 4.3 Setup Screen (Before Standup Starts)

```
┌──────────────────────────────────────────────────────────────┐
│  ◈ Tempo  ▸ Daily Standup  ▸ swift-falcon-17                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│           ⏱ Ready to Start                                   │
│                                                              │
│  ┌──────────────────────────────────────────────────┐        │
│  │  CONFIGURATION                                   │        │
│  │  ─────────────────────────────────────────────   │        │
│  │                                                  │        │
│  │  Per-person timer:     [90 seconds     ▼]        │        │
│  │  Standup target:       [15 minutes     ▼]        │        │
│  │  Speaker order:        [○ Sequential ● Random]   │        │
│  │  Auto-advance:         [████ ON ]                │        │
│  │                                                  │        │
│  └──────────────────────────────────────────────────┘        │
│                                                              │
│  ┌──────────────────────────────────────────────────┐        │
│  │  PARTICIPANTS (4 online)                          │        │
│  │  ─────────────────────────────────────────────   │        │
│  │  🟢 Alice ★ (Facilitator)                        │        │
│  │  🟢 Bob                                          │        │
│  │  🟢 Charlie                                      │        │
│  │  🟢 Eve                                          │        │
│  │                                                  │        │
│  │  Share link: [📋 Copy]  [📱 QR Code]             │        │
│  └──────────────────────────────────────────────────┘        │
│                                                              │
│  ┌──────────────────────────────────────────────────┐        │
│  │            [▶ Start Standup]                      │        │
│  └──────────────────────────────────────────────────┘        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 5. Data Schema (Convex — Standup-Specific)

These tables are **in addition to** the shared tables defined in [PRD.md](./PRD.md).

### `standup_entries`

| Field        | Type                                                                                            | Notes                                    |
| ------------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `roomId`     | `v.id('rooms')`                                                                                 | Foreign key                              |
| `identityId` | `v.string()`                                                                                    | Player identity                          |
| `name`       | `v.string()`                                                                                    | Display name (snapshot at standup start) |
| `order`      | `v.number()`                                                                                    | Position in speaker queue                |
| `status`     | `v.union(v.literal('waiting'), v.literal('speaking'), v.literal('done'), v.literal('skipped'))` | Speaker state                            |
| `startedAt`  | `v.optional(v.number())`                                                                        | When speaking began (for elapsed calc)   |
| `elapsedMs`  | `v.optional(v.number())`                                                                        | Total speaking time in ms                |

### `parking_lot`

| Field        | Type            | Notes            |
| ------------ | --------------- | ---------------- |
| `roomId`     | `v.id('rooms')` | Foreign key      |
| `text`       | `v.string()`    | Item description |
| `identityId` | `v.string()`    | Who added it     |
| `createdAt`  | `v.number()`    | Timestamp        |

### Indexes

```
standup_entries:  by_room(roomId), by_room_order(roomId, order)
parking_lot:     by_room(roomId), by_room_time(roomId, createdAt)
```

### Room Config Shape (Standup)

The `config` field on the shared `rooms` table stores standup-specific settings:

```typescript
// rooms.config for toolType: 'standup'
{
  timerDurationSec: number,      // default: 90
  targetDurationMin: number,     // default: 15
  orderMode: 'sequential' | 'random',  // default: 'sequential'
  autoAdvance: boolean,          // default: true
}
```

## 6. Convex API Contract (Standup-Specific)

### Queries

| Function                    | Args     | Returns                              | Notes                          |
| --------------------------- | -------- | ------------------------------------ | ------------------------------ |
| `standup.listEntries`       | `roomId` | StandupEntry[] sorted by order       | Powers speaker queue           |
| `standup.getCurrentSpeaker` | `roomId` | StandupEntry or null                 | Active speaker with timer info |
| `parkingLot.listByRoom`     | `roomId` | ParkingLotItem[] sorted by createdAt | Powers parking lot panel       |

### Mutations

| Function                | Args                                    | Notes                                                                               |
| ----------------------- | --------------------------------------- | ----------------------------------------------------------------------------------- |
| `standup.start`         | `roomId, identityId`                    | Facilitator-only: populates queue from online players, sets status to `in_progress` |
| `standup.next`          | `roomId, identityId`                    | Facilitator-only: marks current speaker as `done`, starts next                      |
| `standup.previous`      | `roomId, identityId`                    | Facilitator-only: go back to previous speaker                                       |
| `standup.skip`          | `roomId, identityId, targetIdentityId`  | Facilitator-only: mark a speaker as `skipped`                                       |
| `standup.reorder`       | `roomId, identityId, entryId, newOrder` | Facilitator-only: move speaker in queue                                             |
| `standup.pause`         | `roomId, identityId`                    | Facilitator-only: pause the current timer                                           |
| `standup.resume`        | `roomId, identityId`                    | Facilitator-only: resume the current timer                                          |
| `standup.end`           | `roomId, identityId`                    | Facilitator-only: end standup early, show summary                                   |
| `standup.addLateJoiner` | `roomId, identityId`                    | Auto-called when a new player joins mid-standup                                     |
| `standup.updateConfig`  | `roomId, identityId, config`            | Facilitator-only: update timer/order settings                                       |
| `parkingLot.add`        | `roomId, identityId, text`              | Any participant can add item                                                        |
| `parkingLot.remove`     | `roomId, itemId, identityId`            | Remove parking lot item (facilitator or author)                                     |

## 7. Timer Implementation Notes

The timer is a **hybrid client-server** design:

- **Server stores:** `startedAt` timestamp and `elapsedMs` (accumulated paused time).
- **Client computes:** The visual countdown by calculating `timerDurationSec - (now - startedAt + elapsedMs)`.
- **Why hybrid?** Pure server timers would create excessive writes (every second). Pure client timers would drift across participants. The hybrid approach gives real-time visual accuracy with minimal server load.

```
Timer value = timerDuration - (Date.now() - startedAt) / 1000

On pause:  server records elapsedMs += (now - startedAt)
On resume: server sets startedAt = now (elapsedMs already accumulated)
On next:   server records final elapsedMs on current speaker, sets next speaker's startedAt
```

**Auto-advance logic:**

- When client countdown reaches 0, start a 5-second grace period.
- Show "Moving on in 5s..." toast.
- If facilitator doesn't intervene, client calls `standup.next` mutation.

## 8. Accessibility

All accessibility standards from the umbrella [PRD.md](./PRD.md) apply. Additionally:

| Requirement             | Implementation                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Timer announcements** | `aria-live="polite"` region announces when a new speaker starts: "Now speaking: Alice. 90 seconds remaining."                 |
| **Time warnings**       | `aria-live="assertive"` at 15-second warning: "15 seconds remaining."                                                         |
| **Speaker transitions** | Focus moves to the timer/speaker area when speakers change.                                                                   |
| **Parking lot**         | Parking lot input is keyboard accessible, items announced when added.                                                         |
| **Reduced motion**      | Progress ring animation replaced with a simple percentage text display. Pulsing red timer replaced with solid red background. |
| **Color independence**  | Timer states use both color AND text labels ("Over time", "Warning", etc.)                                                    |

## 9. Edge Cases

| Scenario                           | Behavior                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Solo standup**                   | Works fine — one person in queue, timer still runs (useful for practice/demo)                                                |
| **Facilitator leaves mid-standup** | Timer pauses. "Claim Facilitator" banner appears. New facilitator can resume.                                                |
| **All speakers done**              | Auto-transition to `complete` state, showing summary.                                                                        |
| **Player joins after start**       | Added to end of queue as `waiting`. Announced via toast.                                                                     |
| **Player leaves while speaking**   | Auto-skip to next speaker. Elapsed time still recorded.                                                                      |
| **Browser tab hidden**             | Timer continues (uses `startedAt` math, not `setInterval`). Visual updates resume when tab is focused.                       |
| **Network disconnect**             | "Reconnecting..." banner (shared infra). Timer display freezes but resumes accurately on reconnect (server timestamp-based). |

## 10. Responsive Breakpoints

Uses the same breakpoint system as the umbrella design system:

| Breakpoint              | Layout                                                                  |
| ----------------------- | ----------------------------------------------------------------------- |
| **Mobile** (<640px)     | Stacked: timer → next up list → parking lot → controls                  |
| **Tablet** (640–1023px) | Stacked but wider: timer + queue side-by-side on top, parking lot below |
| **Desktop** (≥1024px)   | Two-column: timer/controls (left) + queue/parking lot sidebar (right)   |

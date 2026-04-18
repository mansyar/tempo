# Implementation Plan: Emoji Reactions & Automated Cleanup

## Phase 1: Database & Backend Logic [checkpoint: cf0388a]

- [x] Task: Implement reactions Schema and Mutations (de7f803)
  - [x] Write unit tests for `reactions:send` and `reactions:listRecent`
  - [x] Update `convex/schema.ts` with `reactions` table and index by `roomId`
  - [x] Implement `convex/reactions.ts` with `send` mutation and `listRecent` query
- [x] Task: Implement Stale Room Cleanup Cron Job (ee56efc)
  - [x] Write tests for `cleanup.staleRooms`
  - [x] Implement `cleanup.staleRooms` in `convex/crons.ts` to delete rooms and cascading data where `updatedAt` is older than 24h
  - [x] Register `cleanup.staleRooms` cron job to run every hour
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database & Backend Logic' (88f260e)

## Phase 2: Reaction UI & Real-Time Sync

- [x] Task: Build Emoji Reaction Bar (fe81cdc)
  - [x] Write tests for `EmojiActionBar` component rendering and keyboard accessibility
  - [x] Implement `EmojiActionBar` with predefined emojis (❤️, 👏, 🔥, 😂, 🎉)
- [x] Task: Implement Optimistic Batching Logic (9644610)
  - [x] Write tests for local throttling/batching utility function
  - [x] Wire up the UI action bar to trigger immediate local state and delayed/batched Convex mutations
- [ ] Task: Integrate `reactions.listRecent` Subscription
  - [ ] Write tests for real-time subscription hook consuming recent reactions
  - [ ] Implement UI state subscription to merge local optimistic reactions with remote incoming reactions
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Reaction UI & Real-Time Sync' (Protocol in workflow.md)

## Phase 3: The "Juice" (Animations & A11y Fallbacks)

- [ ] Task: Implement Framer Motion Emoji Burst
  - [ ] Write tests to verify `framer-motion` variants for emoji burst from player's card
  - [ ] Implement the `EmojiBurst` component utilizing physics-based layout and coordinate tracking from the voting table cards
- [ ] Task: Implement Auto-Expiration
  - [ ] Write tests for 5-second auto-expiration of rendered emojis
  - [ ] Implement DOM removal logic for expired floating emojis
- [ ] Task: Implement A11y Fallback (`prefers-reduced-motion`)
  - [ ] Write tests verifying `prefers-reduced-motion` detection
  - [ ] Implement static Fade In/Out variant instead of the burst animation for users with reduced motion enabled
- [ ] Task: Conductor - User Manual Verification 'Phase 3: The "Juice" (Animations & A11y Fallbacks)' (Protocol in workflow.md)

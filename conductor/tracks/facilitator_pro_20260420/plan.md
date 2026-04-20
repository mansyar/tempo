# Implementation Plan: Facilitator Pro & Session Continuity

## Phase 1: Identity Sync & Mobile Controller [checkpoint: 21ccbb0]

- [x] Task: Implement Sync Token Schema and Mutations cbf65158
  - [ ] Write unit tests for `sync:create` (token generation) and `sync:verify` (token consumption)
  - [ ] Update `convex/schema.ts` with `sync_tokens` table (linked to `identityId`, includes `expiresAt` and `isUsed`)
  - [ ] Implement `convex/sync.ts` with `create` and `verify` functions
- [x] Task: Build Sync Mobile Tab in InviteModal.tsx 34165fc
  - [ ] Write tests for `SyncMobileTab` rendering and QR code generation with the sync token
  - [ ] Implement the UI for generating and displaying the "Sync Controller" QR code
- [x] Task: Implement Client-Side Identity Mirroring 8b10516
  - [ ] Write tests for token detection and `identityId` replacement logic in `useIdentity.ts`
  - [ ] Implement logic in the root loader or `useIdentity` hook to detect `?sync=TOKEN` and call `sync:verify`
- [x] Task: Build "Mobile Controller Mode" UI e438db8
  - [ ] Write tests for detecting mobile devices and synced sessions
  - [ ] Create a compact `MobileController.tsx` component with haptic-first voting and facilitator controls
  - [ ] Update `RoomPage.tsx` to conditionally render the controller mode for synced mobile users
- [x] Task: Conductor - User Manual Verification 'Phase 1: Identity Sync & Mobile Controller' (Protocol in workflow.md) 21ccbb0

## Phase 2: Round Timer & Facilitator Nudge [checkpoint: 46e8d0d]

- [x] Task: Implement Round Timer Logic in Convex 87f9c23
  - [ ] Write tests for timer auto-start on first vote and manual reset
  - [ ] Update `convex/schema.ts` to include `timerStartedAt` in the `rooms` table
  - [ ] Implement `rooms:startTimer` and `rooms:resetTimer` mutations
- [x] Task: Build UI Timer Component 355b2f6
  - [ ] Write tests for real-time timer countdown and synchronization across clients
  - [ ] Implement `RoundTimer.tsx` and integrate it into the `ActiveTopicHeader.tsx`
- [x] Task: Implement "Nudge" Mutation and Haptic Triggers 9766f87
  - [ ] Write tests for `players:nudge` mutation (ensuring it's facilitator-only)
  - [ ] Implement `players:nudge` mutation to broadcast a targeted nudge event
  - [ ] Update `usePresence.ts` to listen for nudge events and trigger a haptic pulse/toast on the player's device
- [x] Task: Conductor - User Manual Verification 'Phase 2: Round Timer & Facilitator Nudge' (Protocol in workflow.md) 46e8d0d

## Phase 3: Session Exporter & Advanced Settings [checkpoint: none]

- [x] Task: Implement Session Export Utilities 7f13f76
  - [ ] Write unit tests for Markdown Table, Summary List, and CSV format generators
  - [ ] Implement `utils/exporter.ts` to transform completed topics and estimates into the requested formats
- [x] Task: Add Export UI to Topic Sidebar 02850e7
  - [ ] Write tests for the "Export Session" button and file download triggers
  - [ ] Implement the export menu in `TopicSidebar.tsx` history section
- [x] Task: Implement Advanced Room Settings (Auto-Reveal & T-Shirt Sizing) a994d65
  - [ ] Write tests for `Auto-Reveal` logic (revealing once all online players have voted)
  - [ ] Update `convex/schema.ts` with `autoReveal` toggle and `scaleType` in the `rooms` table
  - [ ] Update `CardDeck.tsx` and `StatsPanel.tsx` to support the T-Shirt Sizing scale (S, M, L, XL, ?)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Session Exporter & Advanced Settings' (Protocol in workflow.md)

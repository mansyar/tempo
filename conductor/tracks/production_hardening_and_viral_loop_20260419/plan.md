# Implementation Plan: Production Hardening & Viral Loop

## Phase 1: Human-Readable Slugs & Social Sharing [checkpoint: ]

- [x] Task: Implement Human-Readable Slug Generator in Convex bc95ffb
  - [x] Write tests for slug uniqueness and format (adjective-noun-number)
  - [x] Implement slug generation logic using `unique-names-generator` in `convex/rooms.ts`
- [ ] Task: Build `InviteModal.tsx` and Integrate QR Code
  - [ ] Write tests for `InviteModal` rendering, QR code generation, and clipboard interaction
  - [ ] Implement `InviteModal.tsx` featuring a QR code (via `qrcode.react`), a "Copy Link" button, and Web Share API integration
- [ ] Task: Refactor `RoomPage.tsx` to use `InviteModal`
  - [ ] Write tests for the "Copy Invite" button correctly triggering the modal
  - [ ] Replace the simple `navigator.clipboard` logic with a state-controlled modal trigger
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Human-Readable Slugs & Social Sharing' (Protocol in workflow.md)

## Phase 2: Unified Feedback & Resilience [checkpoint: ]

- [ ] Task: Integrate `sonner` for Global Toasts
  - [ ] Write tests for toast triggers on success/error events
  - [ ] Setup `Toaster` in `__root.tsx` and replace existing alerts with `toast()` for copy-success and errors
- [ ] Task: Implement Scoped Error Boundaries
  - [ ] Write tests for component-level crash recovery (fallback UI)
  - [ ] Implement `SectionErrorBoundary` wrapper and apply to Sidebar and Table components
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Unified Feedback & Resilience' (Protocol in workflow.md)

## Phase 3: Performance Audit & Asset Optimization [checkpoint: ]

- [ ] Task: Bundle Size Audit & Lazy Loading
  - [ ] Run `pnpm run build` and analyze bundle (aim for <200KB gzipped)
  - [ ] Implement `React.lazy` for `BatchAddModal`, `StatsPanel`, and the new `InviteModal`
- [ ] Task: Optimize Static Assets
  - [ ] Convert sound assets to highly compressed formats
  - [ ] Verify SVGs are optimized and bundled efficiently
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Performance Audit & Asset Optimization' (Protocol in workflow.md)

## Phase 4: Final UX Audit & Production Readiness [checkpoint: ]

- [ ] Task: Verify PWA & Offline Experience
  - [ ] Manual verification of "Standalone" mode and "Reconnecting" banner
  - [ ] Audit tab-title synchronization under stress (rapid state changes)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final UX Audit & Production Readiness' (Protocol in workflow.md)

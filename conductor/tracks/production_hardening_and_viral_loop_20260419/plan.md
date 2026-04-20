# Implementation Plan: Production Hardening & Viral Loop

## Phase 1: Human-Readable Slugs & Social Sharing [checkpoint: e1aba8b]

- [x] Task: Implement Human-Readable Slug Generator in Convex bc95ffb
  - [x] Write tests for slug uniqueness and format (adjective-noun-number)
  - [x] Implement slug generation logic using `unique-names-generator` in `convex/rooms.ts`
- [x] Task: Build `InviteModal.tsx` and Integrate QR Code 00e8d3d
  - [x] Write tests for `InviteModal` rendering, QR code generation, and clipboard interaction
  - [x] Implement `InviteModal.tsx` featuring a QR code (via `qrcode.react`), a "Copy Link" button, and Web Share API integration
- [x] Task: Refactor `RoomPage.tsx` to use `InviteModal` 3608f18
  - [x] Write tests for the "Copy Invite" button correctly triggering the modal
  - [x] Replace the simple `navigator.clipboard` logic with a state-controlled modal trigger
- [x] Task: Conductor - User Manual Verification 'Phase 1: Human-Readable Slugs & Social Sharing' (Protocol in workflow.md) e1aba8b

## Phase 2: Unified Feedback & Resilience [checkpoint: cc25335]

- [x] Task: Integrate `sonner` for Global Toasts aef1986
  - [x] Write tests for toast triggers on success/error events
  - [x] Setup `Toaster` in `__root.tsx` and replace existing alerts with `toast()` for copy-success and errors
- [x] Task: Implement Scoped Error Boundaries 6fd2dfb
  - [x] Write tests for component-level crash recovery (fallback UI)
  - [x] Implement `SectionErrorBoundary` wrapper and apply to Sidebar and Table components
- [x] Task: Conductor - User Manual Verification 'Phase 2: Unified Feedback & Resilience' (Protocol in workflow.md) cc25335

## Phase 3: Performance Audit & Asset Optimization [checkpoint: 08a23d9]

- [x] Task: Bundle Size Audit & Lazy Loading 6ad08a4
  - [x] Run `pnpm run build` and analyze bundle (aim for <200KB gzipped)
  - [x] Implement `React.lazy` for `BatchAddModal`, `StatsPanel`, and the new `InviteModal`
- [x] Task: Optimize Static Assets ac5cb66
  - [x] Convert sound assets to highly compressed formats
  - [x] Verify SVGs are optimized and bundled efficiently
- [x] Task: Conductor - User Manual Verification 'Phase 3: Performance Audit & Asset Optimization' (Protocol in workflow.md) 08a23d9

## Phase 4: Final UX Audit & Production Readiness [checkpoint: ]

- [ ] Task: Verify PWA & Offline Experience
  - [ ] Manual verification of "Standalone" mode and "Reconnecting" banner
  - [ ] Audit tab-title synchronization under stress (rapid state changes)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final UX Audit & Production Readiness' (Protocol in workflow.md)

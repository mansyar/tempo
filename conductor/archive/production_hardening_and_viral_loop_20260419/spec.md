# Specification: Production Hardening & Viral Loop

## Overview

This track finalizes the application's "zero-friction" philosophy by implementing human-readable room slugs and a QR-code-based sharing system that allows desktop users to instantly transition their mobile device into a dedicated "PWA controller." It also includes a performance audit to hit PRD targets (<200KB gzipped, <500ms FCP) and a unified notification/error-handling system.

## Functional Requirements

1.  **Human-Readable Room Slugs:**
    - Replace random room creation slugs with a `unique-names-generator` (adjective-noun-number format).
    - Ensure existing rooms with old slugs remain functional.
2.  **QR Code Sharing & Refactored Invite Modal:**
    - Refactor the existing "Copy Invite" button in the room header to trigger an **Invite Modal**.
    - Show a QR code within the modal that links directly to the current room's URL.
    - Include a "Copy Link" button within the modal with instant visual feedback (Toast).
    - Add a native "Share" button for mobile users leveraging the Web Share API.
3.  **Unified Toast System (`sonner`):**
    - Implement global `sonner` notifications for:
      - Success (e.g., "Link copied!", "Vote cast!").
      - Errors (e.g., "Connection lost", "Facilitator only action").
      - Information (e.g., "A new player joined").
4.  **Resilient Error Handling (Scoped Boundaries):**
    - Implement separate Error Boundaries for the `PresenceSidebar`, `TopicSidebar`, and the main `VotingTable`.
    - Provide a custom "Oops, this section crashed" fallback UI with a "Try Again" button.
5.  **Performance & Asset Optimization:**
    - Audit the initial bundle size to ensure it's <200KB gzipped.
    - Implement lazy loading for the `BatchAddModal`, `StatsPanel`, and the new `InviteModal`.
    - Optimize sound assets (using `.opus` or highly compressed `.mp3`) and SVG icons.

## Non-Functional Requirements

- **Performance:** <500ms First Contentful Paint.
- **Bundle Size:** <200KB gzipped.
- **A11y:** Ensure Toast notifications are announced by screen readers (handled by `sonner`).

## Acceptance Criteria

- [ ] Room creation generates slugs like `clumsy-tiger-22`.
- [ ] The "Copy Invite" button correctly opens the Invite Modal.
- [ ] QR codes are correctly generated and scan-able by mobile devices.
- [ ] Toast notifications appear on success/error actions.
- [ ] If one component crashes, the rest of the application remains interactive.
- [ ] Initial bundle size (gzipped) is verified below 200KB.

## Out of Scope

- Dynamic room permissions (remains fully open).
- Persisting toast history.

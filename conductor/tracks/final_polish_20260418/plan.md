# Implementation Plan: Final Polish, Accessibility & Deployment

## Phase 1: PWA & Offline Resilience [checkpoint: bc52e91]

- [x] Task: Setup Web Manifest and Service Worker (b5cf271)
  - [ ] Write unit tests for service worker registration behavior
  - [ ] Configure `manifest.json` for standalone PWA installation
  - [ ] Implement service worker registration for offline caching
- [x] Task: Implement Reconnecting Banner (ebf4283)
  - [ ] Write tests for `OfflineBanner` component rendering based on network state
  - [ ] Implement a subtle banner overlay to indicate disconnected status
- [x] Task: Dynamic Theme Color Integration (dbdda18)
  - [ ] Write tests for theme color `<meta>` tag synchronization
  - [ ] Implement logic to sync `theme_color` with the Dark/Light mode toggle
- [x] Task: Conductor - User Manual Verification 'Phase 1: PWA & Offline Resilience' (Protocol in workflow.md) (bc52e91)

## Phase 2: Sensory "Juice" & Haptics [checkpoint: 357e44a]

- [x] Task: Implement Haptic Triggers (`navigator.vibrate`) (b52e86f)
  - [ ] Write tests for safe vibration invocation (graceful fallback)
  - [ ] Implement vibration logic for Card Selection, The Reveal, and Unanimous Consensus
- [x] Task: Update Juice/Settings Toggle (bc04bb0)
  - [ ] Write tests to verify the unified toggle controls both audio and haptics
  - [ ] Update `JuiceToggle` component to manage the unified global state
- [x] Task: Conductor - User Manual Verification 'Phase 2: Sensory "Juice" & Haptics' (Protocol in workflow.md) (357e44a)

## Phase 3: Accessibility Announcements [checkpoint: 3362f3a]

- [x] Task: Implement ARIA Live Announcer (e3148cf)
  - [ ] Write tests for `AriaLiveAnnouncer` component
  - [ ] Implement an invisible, polite `aria-live` region for screen readers
- [x] Task: Announce Game State Changes (257bd07)
  - [ ] Write tests for dispatching announcement messages
  - [ ] Integrate announcements for "Votes Revealed", "New Topic Active", and "Consensus Reached"
- [x] Task: Conductor - User Manual Verification 'Phase 3: Accessibility Announcements' (Protocol in workflow.md) (3362f3a)

## Phase 4: Deployment Architecture

- [x] Task: Create Multi-stage Dockerfile (6d4ac6c)
  - [ ] Create a `Dockerfile` using `node:22-alpine` as build and runtime environments
  - [ ] Configure `pnpm` installation, build steps, and expose the correct port
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Deployment Architecture' (Protocol in workflow.md)

## Phase: Review Fixes

- [ ] Task: Apply review suggestions

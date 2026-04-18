# Implementation Plan: Core Gameplay Loop

## Phase 1: Real-Time Presence & Facilitator Logic [checkpoint: 4f95697]

- [x] Task: Implement Presence Heartbeat and Timeout in Convex (f51ee0d)
  - [x] Write tests for `players:heartbeat` and cron-based offline marking
  - [x] Implement `players:heartbeat` mutation and `cleanup:offlinePlayers` cron
- [x] Task: Implement Facilitator Handoff and Claiming (824d6d0)
  - [x] Write tests for facilitator logic (auto-assign on join, claim if current is offline)
  - [x] Implement `players:claimFacilitator` mutation
- [x] Task: Build Presence Sidebar and Claim Banner (f6b5353)
  - [x] Write tests for `PresenceSidebar` and `ClaimBanner` components
  - [x] Implement UI for real-time player list and "Claim Facilitator" notification
- [x] Task: Conductor - User Manual Verification 'Presence & Facilitator Logic' (4f95697)

## Phase 2: "The Mask" – Secure Voting Backend [checkpoint: 7eeb454]

- [x] Task: Implement Masked Voting Schema and Mutations (e8b7f9b)
  - [x] Write tests for `votes:cast` and masked `votes:listByRoom` query
  - [x] Implement `votes:cast` and `votes:listByRoom` with server-side masking
- [x] Task: Implement Room State Controls (Reveal/Reset) (8f05ba8)
  - [x] Write tests for `rooms:reveal` and `rooms:reset` (facilitator-only)
  - [x] Implement facilitator mutations for round management
- [x] Task: Conductor - User Manual Verification 'The Mask Backend' (7eeb454)

## Phase 3: Gaming UI & 3D Animations [checkpoint: 6fd37ac]

- [x] Task: Create 3D Tilt Poker Card Components (d503da5)
  - [x] Write tests for `PokerCard` tilt and selection states
  - [x] Implement `PokerCard` using Framer Motion (perspective + tilt)
- [x] Task: Implement The Reveal Animation Sequence (67d291b)
  - [x] Write tests for staggered reveal logic
  - [x] Implement staggered Y-axis flip sequence on `revealed` state
- [x] Task: Build Responsive Mobile Card Deck (b7ea3e7)
  - [x] Write tests for mobile card grid vs desktop row layouts
  - [x] Implement responsive `CardDeck` container
- [x] Task: Conductor - User Manual Verification 'Gaming UI & Animations' (6fd37ac)

## Phase 4: Results, Statistics & Sensory Juice

- [x] Task: Implement Statistics Calculation and Outlier Logic (6e02dcd)
  - [x] Write unit tests for Avg/Median/Mode and Outlier detection
  - [x] Implement utility functions for consensus and outlier highlighting
- [x] Task: Generate and Integrate UI Sound Assets (d2c3f07)
  - [x] Create Python script to generate pop/whoosh/confetti audio files
  - [x] Implement `useSound` hook and integrate into voting/reveal actions
- [ ] Task: Implement Celebration Effects (Confetti)
  - [ ] Write tests for unanimous consensus trigger
  - [ ] Integrate `canvas-confetti` and trigger on unanimous results
- [ ] Task: Conductor - User Manual Verification 'Results & Sensory Polish' (Protocol in workflow.md)

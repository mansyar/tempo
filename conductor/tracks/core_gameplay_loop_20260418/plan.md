# Implementation Plan: Core Gameplay Loop

## Phase 1: Real-Time Presence & Facilitator Logic

- [ ] Task: Implement Presence Heartbeat and Timeout in Convex
  - [ ] Write tests for `players:heartbeat` and cron-based offline marking
  - [ ] Implement `players:heartbeat` mutation and `cleanup:offlinePlayers` cron
- [ ] Task: Implement Facilitator Handoff and Claiming
  - [ ] Write tests for facilitator logic (auto-assign on join, claim if current is offline)
  - [ ] Implement `players:claimFacilitator` mutation
- [ ] Task: Build Presence Sidebar and Claim Banner
  - [ ] Write tests for `PresenceSidebar` and `ClaimBanner` components
  - [ ] Implement UI for real-time player list and "Claim Facilitator" notification
- [ ] Task: Conductor - User Manual Verification 'Presence & Facilitator Logic' (Protocol in workflow.md)

## Phase 2: "The Mask" – Secure Voting Backend

- [ ] Task: Implement Masked Voting Schema and Mutations
  - [ ] Write tests for `votes:cast` and masked `votes:listByRoom` query
  - [ ] Implement `votes:cast` and `votes:listByRoom` with server-side masking
- [ ] Task: Implement Room State Controls (Reveal/Reset)
  - [ ] Write tests for `rooms:reveal` and `rooms:reset` (facilitator-only)
  - [ ] Implement facilitator mutations for round management
- [ ] Task: Conductor - User Manual Verification 'The Mask Backend' (Protocol in workflow.md)

## Phase 3: Gaming UI & 3D Animations

- [ ] Task: Create 3D Tilt Poker Card Components
  - [ ] Write tests for `PokerCard` tilt and selection states
  - [ ] Implement `PokerCard` using Framer Motion (perspective + tilt)
- [ ] Task: Implement The Reveal Animation Sequence
  - [ ] Write tests for staggered reveal logic
  - [ ] Implement staggered Y-axis flip sequence on `revealed` state
- [ ] Task: Build Responsive Mobile Card Deck
  - [ ] Write tests for mobile card grid vs desktop row layouts
  - [ ] Implement responsive `CardDeck` container
- [ ] Task: Conductor - User Manual Verification 'Gaming UI & Animations' (Protocol in workflow.md)

## Phase 4: Results, Statistics & Sensory Juice

- [ ] Task: Implement Statistics Calculation and Outlier Logic
  - [ ] Write unit tests for Avg/Median/Mode and Outlier detection
  - [ ] Implement utility functions for consensus and outlier highlighting
- [ ] Task: Generate and Integrate UI Sound Assets
  - [ ] Create Python script to generate pop/whoosh/confetti audio files
  - [ ] Implement `useSound` hook and integrate into voting/reveal actions
- [ ] Task: Implement Celebration Effects (Confetti)
  - [ ] Write tests for unanimous consensus trigger
  - [ ] Integrate `canvas-confetti` and trigger on unanimous results
- [ ] Task: Conductor - User Manual Verification 'Results & Sensory Polish' (Protocol in workflow.md)

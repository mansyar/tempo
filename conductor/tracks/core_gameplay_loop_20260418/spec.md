# Specification: Core Gameplay Loop

## Overview

This track implements the primary real-time engine of Pointy. It transforms the app from a UI shell into a functional game by handling presence, server-side masked voting ("The Mask"), and the results dashboard with 3D animations and consensus logic.

## Functional Requirements

1.  **Presence 2.0:**
    - Implement 10s heartbeats and 30s timeout for offline status.
    - Add `beforeunload` listener for instant disconnect signals.
    - Implement "Claim Facilitator" logic if the current facilitator goes offline (displayed as a sidebar banner).
2.  **The Mask (Voting Logic):**
    - Convex mutation to cast votes.
    - Convex query that masks `value` (returns `null`) for all players except the current user while the room status is `voting`.
    - Support for the Fibonacci scale: `0, 1, 2, 3, 5, 8, 13, 21, ?, ☕`.
3.  **Real-Time Reveal:**
    - Facilitator mutation to trigger `revealed` state.
    - Staggered reveal animation (Linear/Random) using Framer Motion 3D transforms.
4.  **Results Dashboard:**
    - Calculate Average, Median, and Mode (numeric only).
    - Determine Consensus Level (Unanimous, Near Consensus, Split).
    - Highlight outliers (furthest from median) only when state is "Split".
5.  **Sensory Juice:**
    - Python-generated UI sound effects (pop, whoosh, confetti-pop).
    - Confetti trigger on Unanimous consensus.

## Non-Functional Requirements

- **Latency:** Voting and reveal updates must propagate in < 150ms.
- **Performance:** 3D card flips must maintain 60fps on mobile.
- **Accessibility:** ARIA-live announcements for "Votes Revealed" and "Consensus Reached".

## Acceptance Criteria

- [ ] Player sidebar accurately reflects real-time online/offline/voted status.
- [ ] Votes remain hidden from other players (server-side) until reveal.
- [ ] 3D card flip animations trigger correctly on reveal.
- [ ] Consensus logic correctly identifies "Unanimous" and triggers confetti.
- [ ] "Claim Facilitator" banner appears and functions when needed.

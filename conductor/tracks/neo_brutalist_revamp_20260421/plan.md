# Implementation Plan: Neo-Brutalist UI Revamp

## Phase 1: Foundations & Global Styling

- [x] Task: Configure Tailwind CSS v4 Neo-Brutalist Foundations 565f8b0
  - [x] Update `src/styles.css` to define the new color palette (Retro Yellow #f7df1e, Blue-300, Green-400).
  - [x] Implement global `.brutal-border` (4px solid #000, 8px radius) and `.brutal-shadow` (6px offset) classes.
  - [x] Add the `bg-grid` radial-gradient pattern to the global styles.
  - [x] Integrate "Space Grotesk" via Google Fonts and set as default typeface.
- [x] Task: Implement Global Page Layout Foundation 3257c31
  - [x] Write tests to verify typography and global style application.
  - [x] Implement the `translate(4px, 4px)` active state logic for all `.brutal-shadow` elements.
  - [x] Update the root layout to include the `bg-grid` background and basic Neo-Brutalist container rules.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundations & Global Styling' (Protocol in workflow.md)

## Phase 2: Landing Page Revamp

- [ ] Task: Redesign Landing Page Hero & Structure
  - [ ] Write tests for the new Landing Page component structure.
  - [ ] Implement the Hero section with `mix-blend-multiply` headers and `rotate-12` badges.
  - [ ] Add the scrolling ticker-tape component for key value propositions.
- [ ] Task: Revamp Landing Feature Cards
  - [ ] Write tests for card interactions (hover/click feedback).
  - [ ] Implement the "Shadow Shift" active state using `translate(4px, 4px)`.
  - [ ] Replace existing card styles with the `brutal-border` and vibrant background colors.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Landing Page Revamp' (Protocol in workflow.md)

## Phase 3: Room & Poker UI Revamp

- [ ] Task: Redesign Poker Room Layout & Sidebar
  - [ ] Write tests for the updated Room sidebar and participant list.
  - [ ] Implement heavy borders, solid backgrounds, and the new font in the Room UI.
  - [ ] Remove all glassmorphism and soft gradients from the Room layout.
- [ ] Task: Revamp Poker Estimation Cards & Modals
  - [ ] Write tests for the redesigned Poker cards and their 3D transform states.
  - [ ] Update cards to use snappy transforms and rigid transitions.
  - [ ] Revamp all interactive modals (Invite, Settings, etc.) with Neo-Brutalist styling.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Room & Poker UI Revamp' (Protocol in workflow.md)

## Phase 4: Global Interactions & Final Polish

- [ ] Task: Implement Universal Interaction Feedback & Accents
  - [ ] Verify "Shadow Shift" feedback is active on all interactive elements across the app.
  - [ ] Add subtle floating background elements (circles/squares) as background accents.
- [ ] Task: Accessibility Audit & Responsive Refinement
  - [ ] Run automated and manual accessibility checks for WCAG 2.1 AA compliance.
  - [ ] Fine-tune mobile responsive scaling for all new components.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Global Interactions & Final Polish' (Protocol in workflow.md)

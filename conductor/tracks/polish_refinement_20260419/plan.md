# Implementation Plan: Final Product Polish & Refinement

## Phase 1: Facilitator Queue Management (Inline Editing) [checkpoint: d4c138a]

- [x] Task: Implement `topics:update` mutation in Convex 03943ce
  - [x] Write unit tests for `topics:update` mutation
  - [x] Implement `update` function in `convex/topics.ts`
- [x] Task: Build Inline Editing UI in `TopicSidebar` ad3ce1e
  - [x] Write tests for click-to-edit behavior, including blur and Enter key triggers
  - [x] Implement seamless input field replacement in `TopicSidebar.tsx`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Facilitator Queue Management' (Protocol in workflow.md) d4c138a

## Phase 2: Result Insights & Outlier Discussion [checkpoint: dd3b385]

- [x] Task: Implement "Needs Discussion" Badge for Outliers 98c24c5
  - [x] Write tests for `StatsPanel` outlier detection and badge rendering
  - [x] Add the red text badge next to outlier names in `PresenceSidebar.tsx` or wherever outliers are listed in the results view
- [x] Task: Add Descriptive Tooltips to Stats 98c24c5
  - [x] Write tests for tooltip presence and content on Average/Median/Mode stats
  - [x] Implement tooltips (using accessible titles or a simple hover state) in the stats component
- [x] Task: Conductor - User Manual Verification 'Phase 2: Result Insights & Outlier Discussion' (Protocol in workflow.md) dd3b385

## Phase 3: Hero Experience & Landing Page [checkpoint: edf4ea7]

- [x] Task: Update Landing Page with Feature Highlight Cards 1461be8
  - [x] Write tests for landing page rendering and card interactions
  - [x] Implement 3D, glassmorphic, icon-centric cards in `LandingPage.tsx`
- [x] Task: Implement Dynamic Tab Title Synchronization 49728a1
  - [x] Write tests for document title changes based on room state
  - [x] Implement a custom hook or effect in `RoomPage.tsx` to manage `document.title`
- [x] Task: Conductor - User Manual Verification 'Phase 3: Hero Experience & Landing Page' (Protocol in workflow.md) edf4ea7

## Phase 4: UX Polish & Final Audit [checkpoint: a36fb1d]

- [x] Task: Refine Topic State Visibility in History fe8b22a
  - [x] Write tests for visual distinction between topic states
  - [x] Update CSS/Styles in `TopicSidebar` for better state clarity
- [x] Task: Conductor - User Manual Verification 'Phase 4: UX Polish & Final Audit' (Protocol in workflow.md) a36fb1d

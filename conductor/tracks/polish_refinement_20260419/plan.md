# Implementation Plan: Final Product Polish & Refinement

## Phase 1: Facilitator Queue Management (Inline Editing) [checkpoint: d4c138a]

- [x] Task: Implement `topics:update` mutation in Convex 03943ce
  - [x] Write unit tests for `topics:update` mutation
  - [x] Implement `update` function in `convex/topics.ts`
- [x] Task: Build Inline Editing UI in `TopicSidebar` ad3ce1e
  - [x] Write tests for click-to-edit behavior, including blur and Enter key triggers
  - [x] Implement seamless input field replacement in `TopicSidebar.tsx`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Facilitator Queue Management' (Protocol in workflow.md) d4c138a

## Phase 2: Result Insights & Outlier Discussion [checkpoint: ]

- [x] Task: Implement "Needs Discussion" Badge for Outliers 98c24c5
  - [x] Write tests for `StatsPanel` outlier detection and badge rendering
  - [x] Add the red text badge next to outlier names in `PresenceSidebar.tsx` or wherever outliers are listed in the results view
- [x] Task: Add Descriptive Tooltips to Stats 98c24c5
  - [x] Write tests for tooltip presence and content on Average/Median/Mode stats
  - [x] Implement tooltips (using accessible titles or a simple hover state) in the stats component
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Result Insights & Outlier Discussion' (Protocol in workflow.md)

## Phase 3: Hero Experience & Landing Page [checkpoint: ]

- [ ] Task: Update Landing Page with Feature Highlight Cards
  - [ ] Write tests for landing page rendering and card interactions
  - [ ] Implement 3D, glassmorphic, icon-centric cards in `LandingPage.tsx`
- [ ] Task: Implement Dynamic Tab Title Synchronization
  - [ ] Write tests for document title changes based on room state
  - [ ] Implement a custom hook or effect in `RoomPage.tsx` to manage `document.title`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Hero Experience & Landing Page' (Protocol in workflow.md)

## Phase 4: UX Polish & Final Audit [checkpoint: ]

- [ ] Task: Refine Topic State Visibility in History
  - [ ] Write tests for visual distinction between topic states
  - [ ] Update CSS/Styles in `TopicSidebar` for better state clarity
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UX Polish & Final Audit' (Protocol in workflow.md)

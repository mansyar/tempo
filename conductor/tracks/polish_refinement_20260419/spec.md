# Specification: Final Product Polish & Refinement

## Overview

This track focuses on the final layer of product polish and refinement as specified in the PRD, bridging the gap between a functional prototype and a production-grade application. It targets three key areas: facilitator queue management, result interpretation for outliers, and a "gaming-grade" landing page.

## Functional Requirements

1.  **Facilitator Queue Management (Inline Editing):**
    - **Trigger:** Seamless click-to-edit for any `pending` topic title in the `TopicSidebar`.
    - **Confirmation:** Automatically save changes on "Enter" or "Blur" (focus loss).
    - **Visual Feedback:** Subtle background change or border during editing to indicate the active input field.
2.  **Result Insights & Outlier Discussion:**
    - **Callout Badge:** When the consensus state is "Split" (spread > 2), a prominent red badge with the text "Needs Discussion" should appear next to the outliers' names in the stats panel.
    - **Tooltips:** Add descriptive tooltips to the numeric statistics (Average, Median, Mode) in the results panel to clarify that non-numeric votes (`?`, `☕`) are excluded from these calculations.
3.  **Hero Experience & Landing Page:**
    - **Feature Highlight Cards:** Implement a grid of feature cards on the landing page (`/`) featuring 3D tilt effects on hover, glassmorphic styling (background blur), and icon-centric layouts.
    - **Dynamic Tab Title:** Update the browser tab title in real-time based on game state:
      - `🔴 Voting... | Pointy`
      - `🟢 Revealed | Pointy`
      - `Active Topic | Pointy`
4.  **UX Polish:**
    - **Topic State Visibility:** Ensure clear visual distinction between `pending`, `active`, and `completed` topics in the history list (e.g., using subtle opacity shifts or status icons).

## Acceptance Criteria

- [ ] Facilitators can edit pending topic titles without a modal.
- [ ] "Needs Discussion" badges appear automatically on outliers during a "Split" vote.
- [ ] Results panel stats display clarifying tooltips on hover.
- [ ] Landing page features 3D, glassmorphic feature highlight cards.
- [ ] Browser tab title correctly reflects the current game state with emojis.

## Out of Scope

- Integration with external task trackers (Jira/GitHub).
- Customizing the Fibonacci scale.

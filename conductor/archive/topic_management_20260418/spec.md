# Specification: Topic Management & Estimation Workflow

## Overview

This track implements the structured planning poker workflow. It enables facilitators to manage a backlog of topics, allowing teams to estimate items sequentially. The system will track topic statuses, record consensus estimates, and provide a clear history of what has been estimated.

## Functional Requirements

1. **Topic Data Model:**
   - Store topics with `title`, `order` (for sorting), `status` (`pending`, `active`, `completed`), and `finalEstimate`.
   - Each topic is linked to a `roomId`.
2. **Topic Management (Facilitator Only):**
   - **Add Topic:** Inline input for single topic addition.
   - **Batch Add:** A dedicated modal for pasting multiple topics (one per line).
   - **Reorder:** Ability to drag-and-drop or use buttons to move topics in the queue.
   - **Edit/Delete:** Ability to modify titles or remove pending topics.
3. **Estimation Workflow:**
   - **Active Topic:** One topic (or "Free Vote") is marked as active.
   - **Reveal & Confirm:** After revealing votes, the facilitator confirms or edits the final estimate value.
   - **Next Topic:** Once confirmed, the active topic is marked `completed`, the estimate is saved, and the next `pending` topic becomes `active`. All votes are reset for the new round.
4. **UI Components:**
   - **Topic Sidebar:** Visible to all; shows the queue of pending topics and a history of completed items. Players have read-only access; Facilitators see management controls.
   - **Active Topic Header:** Displays the current topic title prominently at the top of the voting area.
   - **Batch Add Modal:** Modal with a multi-line text area for bulk entry.

## Non-Functional Requirements

- **Real-time Sync:** Topic additions and reordering must reflect instantly for all players (< 150ms latency).
- **UX:** Smooth transitions between topics; clear visual distinction between active, pending, and completed items.

## Acceptance Criteria

- [ ] Facilitator can add single topics and batch-add topics via a modal.
- [ ] Topic queue is visible to all players but manageable only by the facilitator.
- [ ] Facilitator can reorder topics, and the change is reflected for all players.
- [ ] "Next Topic" flow correctly saves the confirmed estimate and resets the voting round.
- [ ] History section shows all completed topics with their final estimates.

## Out of Scope

- Integration with external tools (Jira/GitHub) in this phase.
- Rich text descriptions for topics.

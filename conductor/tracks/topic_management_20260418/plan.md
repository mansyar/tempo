# Implementation Plan: Topic Management & Estimation Workflow

## Phase 1: Database & Backend Logic [checkpoint: ]

- [ ] Task: Implement Topic Schema and Core Mutations
  - [ ] Write unit tests for `topics:add`, `topics:listByRoom`, and `topics:remove`
  - [ ] Update `convex/schema.ts` with `topics` table and indexes
  - [ ] Implement `topics.ts` with `add`, `listByRoom`, and `remove` functions
- [ ] Task: Implement Batch Add and Reorder Mutations
  - [ ] Write tests for `topics:addBatch` and `topics:reorder`
  - [ ] Implement `addBatch` mutation for multi-line support
  - [ ] Implement `reorder` mutation using `order` field increments
- [ ] Task: Implement Session Workflow Mutations
  - [ ] Write tests for `rooms:nextTopic` and `topics:setFinalEstimate`
  - [ ] Implement `topics:setFinalEstimate` to update consensus
  - [ ] Implement `rooms:nextTopic` to handle status transitions and vote resets
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Database & Backend Logic' (Protocol in workflow.md)

## Phase 2: Topic Management UI (Facilitator) [checkpoint: ]

- [ ] Task: Build Topic Sidebar Shell and List
  - [ ] Write tests for `TopicSidebar` component (read-only vs facilitator views)
  - [ ] Implement `TopicSidebar` displaying pending topics and history
- [ ] Task: Implement Add & Manage Topic UI
  - [ ] Write tests for inline add input and topic action buttons (Edit/Delete/Reorder)
  - [ ] Implement inline addition and item management controls in sidebar
- [ ] Task: Create Batch Add Modal
  - [ ] Write tests for `BatchAddModal` validation and submission
  - [ ] Implement modal with multi-line textarea and bulk submission logic
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Topic Management UI' (Protocol in workflow.md)

## Phase 3: Estimation Workflow & Session History [checkpoint: ]

- [ ] Task: Implement Active Topic Header & Status Sync
  - [ ] Write tests for `ActiveTopicHeader` and room status synchronization
  - [ ] Implement header display in the main voting area
- [ ] Task: Build "Confirm & Next" Workflow
  - [ ] Write tests for the facilitator's confirm-estimate-and-advance flow
  - [ ] Implement UI for confirming final estimate and triggering `nextTopic`
- [ ] Task: Implement Topic History Display
  - [ ] Write tests for completed topics list with saved estimates
  - [ ] Update sidebar history section with actual data and formatted results
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Estimation Workflow & Session History' (Protocol in workflow.md)

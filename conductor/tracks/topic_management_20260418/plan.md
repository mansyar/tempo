# Implementation Plan: Topic Management & Estimation Workflow

## Phase 1: Database & Backend Logic [checkpoint: 4f63d42]

- [x] Task: Implement Topic Schema and Core Mutations bc2a37d
  - [x] Write unit tests for `topics:add`, `topics:listByRoom`, and `topics:remove`
  - [x] Update `convex/schema.ts` with `topics` table and indexes
  - [x] Implement `topics.ts` with `add`, `listByRoom`, and `remove` functions
- [x] Task: Implement Batch Add and Reorder Mutations 0790ac5
  - [x] Write tests for `topics:addBatch` and `topics:reorder`
  - [x] Implement `addBatch` mutation for multi-line support
  - [x] Implement `reorder` mutation using `order` field increments
- [x] Task: Implement Session Workflow Mutations f676bdc
  - [x] Write tests for `rooms:nextTopic` and `topics:setFinalEstimate`
  - [x] Implement `topics:setFinalEstimate` to update consensus
  - [x] Implement `rooms:nextTopic` to handle status transitions and vote resets
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Database & Backend Logic' (Protocol in workflow.md)

## Phase 2: Topic Management UI (Facilitator) [checkpoint: ]

- [x] Task: Build Topic Sidebar Shell and List 568d7f6
  - [x] Write tests for `TopicSidebar` component (read-only vs facilitator views)
  - [x] Implement `TopicSidebar` displaying pending topics and history
- [x] Task: Implement Add & Manage Topic UI bcef400
  - [x] Write tests for inline add input and topic action buttons (Edit/Delete/Reorder)
  - [x] Implement inline addition and item management controls in sidebar
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

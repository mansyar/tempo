# Implementation Plan: Tempo Rebranding & Multi-Tool Evolution

> **Track ID:** tempo-rebrand_20260421  
> **Phase:** Planning  
> **Status:** Ready for Execution

---

## Phase 1: Branding Updates

- [x] **Task 1.1: Update Header Component with Tempo branding** [d3d47b2]
  - [ ] Change logo from ◆ to ◈
  - [ ] Change text from "Pointy" to "Tempo"
  - [ ] Add breadcrumb trail showing current tool context
  - [ ] Update GitHub link to new repository
  - [ ] Verify Header renders correctly in all contexts
  - [ ] Update Header tests to reflect new branding
  - [ ] Run tests to ensure no regressions

- [x] **Task 1.2: Update Footer Component with Tempo branding** [e3efb2c]
  - [ ] Change copyright text from "© 2026 Pointy" to "© 2026 Tempo"
  - [ ] Verify Footer renders correctly in all contexts
  - [ ] Update Footer tests to reflect new branding
  - [ ] Run tests to ensure no regressions

- [ ] **Task 1.3: Update Landing Page (Hub)**
  - [ ] Transform LandingPage into tool selector hub
  - [ ] Update hero text from "Pointy Poker" to "Tempo"
  - [ ] Update tagline to "Scrum Tools for Modern Teams"
  - [ ] Change CTA from "Create Master Room" to "Create Poker Room"
  - [ ] Reorganize layout to show tool selector
  - [ ] Add "Coming Soon" badge for Daily Standup module
  - [ ] Update LandingPage tests to reflect new layout
  - [ ] Run tests to ensure no regressions

- [ ] **Task 1.4: Update HTML Meta Tags**
  - [ ] Update title tags to use "Tempo" branding
  - [ ] Update og:title and og:description
  - [ ] Ensure dynamic titles reflect "Tempo" branding
  - [ ] Test meta tags render correctly

- [ ] **Task 1.5: Update PWA Manifest**
  - [ ] Update public/manifest.json with Tempo branding
  - [ ] Update name to "Tempo", short_name to "Tempo"
  - [ ] Update description to "Scrum Tools for Modern Teams"
  - [ ] Update theme_color and background_color
  - [ ] Verify manifest validates correctly

- [ ] **Task 1.6: Update Favicons and Icons**
  - [ ] Generate new ◈ logo favicon (ICO format)
  - [ ] Generate new PWA icons (192x192, 512x512)
  - [ ] Update public/ directory with new assets
  - [ ] Verify icons display correctly in browser

- [ ] **Task 1.7: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)**

---

## Phase 2: Schema Migration

- [ ] **Task 2.1: Add toolType Field to Rooms Schema**
  - [ ] Update convex/schema.ts with toolType field
  - [ ] Add toolType field to rooms table schema
  - [ ] Type: v.union(v.literal('poker'), v.literal('standup'))
  - [ ] Make optional initially for backward compatibility
  - [ ] Update schema tests
  - [ ] Run tests to ensure no regressions

- [ ] **Task 2.2: Create Data Migration Script**
  - [ ] Create migration to backfill existing rooms
  - [ ] Write mutation to backfill toolType: 'poker' for all rooms
  - [ ] Test migration on development database
  - [ ] Verify no data corruption occurs
  - [ ] Document migration steps

- [ ] **Task 2.3: Update Room Creation Mutation**
  - [ ] Update rooms.create to accept toolType parameter
  - [ ] Modify mutation signature to accept toolType
  - [ ] Default to 'poker' for existing calls
  - [ ] Update mutation tests
  - [ ] Run tests to ensure no regressions

- [ ] **Task 2.4: Execute Schema Migration**
  - [ ] Run migration on development environment
  - [ ] Deploy updated schema to development Convex
  - [ ] Execute backfill mutation
  - [ ] Verify all rooms have toolType field
  - [ ] Document migration results

- [ ] **Task 2.5: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)**

---

## Phase 3: Route Restructuring

- [ ] **Task 3.1: Create Poker Room Route**
  - [ ] Create src/routes/poker.$slug.tsx
  - [ ] Create new route file for poker rooms
  - [ ] Import and use existing RoomPage component
  - [ ] Add poker-specific context if needed
  - [ ] Update route tests
  - [ ] Run tests to ensure no regressions

- [ ] **Task 3.2: Convert Room Route to Redirect**
  - [ ] Update src/routes/room.$slug.tsx to redirect
  - [ ] Convert existing route to redirect-only
  - [ ] Redirect to /poker/:slug preserving slug
  - [ ] Add comment about 6-month maintenance period
  - [ ] Test redirect functionality
  - [ ] Run tests to ensure no regressions

- [ ] **Task 3.3: Update Landing Page Navigation**
  - [ ] Update LandingPage to use new /poker/:slug route
  - [ ] Change navigation target from /room/:slug to /poker/:slug
  - [ ] Update join room logic to handle new route
  - [ ] Test navigation flow
  - [ ] Run tests to ensure no regressions

- [ ] **Task 3.4: Verify Redirect Functionality**
  - [ ] Manually verify /room/:slug redirects to /poker/:slug
  - [ ] Start development server
  - [ ] Visit legacy /room/:slug URL
  - [ ] Confirm redirect to /poker/:slug
  - [ ] Verify room functionality works after redirect
  - [ ] Document verification results

- [ ] **Task 3.5: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)**

---

## Phase 4: Component Architecture Refactoring

- [ ] **Task 4.1: Create Directory Structure**
  - [ ] Create src/components/shared/ and src/components/poker/ directories
  - [ ] Create shared components directory
  - [ ] Create poker components directory
  - [ ] Verify directory structure created

- [ ] **Task 4.2: Extract Shared Components (Part 1)**
  - [ ] Move components to src/components/shared/ (AriaLiveAnnouncer through JoinModal)
  - [ ] Move AriaLiveAnnouncer.tsx
  - [ ] Move ClaimBanner.tsx
  - [ ] Move EmojiActionBar.tsx
  - [ ] Move EmojiBurst.tsx
  - [ ] Move Footer.tsx
  - [ ] Move Header.tsx
  - [ ] Move InviteModal.tsx
  - [ ] Move JoinModal.tsx
  - [ ] Update all imports referencing these components
  - [ ] Run tests to verify no breaking changes

- [ ] **Task 4.3: Extract Shared Components (Part 2)**
  - [ ] Move components to src/components/shared/ (JuiceToggle through LandingPage)
  - [ ] Move JuiceToggle.tsx
  - [ ] Move OfflineBanner.tsx
  - [ ] Move PresenceSidebar.tsx
  - [ ] Move SectionErrorBoundary.tsx
  - [ ] Move ThemeToggle.tsx
  - [ ] Move LandingPage.tsx
  - [ ] Update all imports referencing these components
  - [ ] Run tests to verify no breaking changes

- [ ] **Task 4.4: Create Poker Components Directory**
  - [ ] Move poker-specific components to src/components/poker/
  - [ ] Move ActiveTopicHeader.tsx
  - [ ] Move BatchAddModal.tsx
  - [ ] Move CardDeck.tsx
  - [ ] Move CardGrid.tsx
  - [ ] Move ConfirmEstimateModal.tsx
  - [ ] Move MobileController.tsx
  - [ ] Move PokerCard.tsx
  - [ ] Move RoomPage.tsx
  - [ ] Move RoomSettingsModal.tsx
  - [ ] Move RoundTimer.tsx
  - [ ] Move StatsPanel.tsx
  - [ ] Move TopicSidebar.tsx
  - [ ] Update all imports referencing these components
  - [ ] Run tests to verify no breaking changes

- [ ] **Task 4.5: Update Test Imports**
  - [ ] Update all test files with new import paths
  - [ ] Search for all component imports in tests/
  - [ ] Update imports to reflect new directory structure
  - [ ] Run full test suite
  - [ ] Verify 100% test pass rate
  - [ ] Verify no coverage regression

- [ ] **Task 4.6: Verify Component APIs**
  - [ ] Verify no breaking changes to component APIs
  - [ ] Review each moved component's props/interface
  - [ ] Ensure exports remain unchanged
  - [ ] Verify type safety maintained
  - [ ] Document any minor API adjustments

- [ ] **Task 4.7: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)**

---

## Phase 5: Documentation Updates

- [ ] **Task 5.1: Update README.md**
  - [ ] Update README with Tempo branding
  - [ ] Update project title to "Tempo"
  - [ ] Update description to reflect multi-tool vision
  - [ ] Update GitHub repository references
  - [ ] Verify README renders correctly

- [ ] **Task 5.2: Update Design System Documentation**
  - [ ] Update DESIGN_SYSTEM.md with Tempo branding
  - [ ] Update title to "Design System: Tempo"
  - [ ] Update component inventory to reflect new structure
  - [ ] Add tool selector hub wireframe
  - [ ] Verify documentation is accurate

- [ ] **Task 5.3: Update PRD Documents**
  - [ ] Create and update PRD documents
  - [ ] Verify PRD.md exists as umbrella document
  - [ ] Verify PRD_POKER.md has module header
  - [ ] Verify PRD_STANDUP.md exists
  - [ ] Update any stale references to "Pointy"

- [ ] **Task 5.4: Verify All Documentation**
  - [ ] Review all documentation for consistency
  - [ ] Check for any remaining "Pointy" references
  - [ ] Verify links are correct
  - [ ] Ensure documentation reflects new architecture

- [ ] **Task 5.5: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)**

---

## Phase 6: Final Verification & Cleanup

- [ ] **Task 6.1: Run Full Test Suite**
  - [ ] Execute complete test suite with coverage
  - [ ] Run `pnpm test` with CI=true
  - [ ] Verify all tests pass
  - [ ] Check code coverage meets >80% requirement
  - [ ] Document any coverage gaps

- [ ] **Task 6.2: Manual End-to-End Verification**
  - [ ] Manually verify complete user flow
  - [ ] Start development server
  - [ ] Verify landing page shows Tempo branding
  - [ ] Create new poker room
  - [ ] Verify room uses /poker/:slug route
  - [ ] Test room functionality (voting, reveal, etc.)
  - [ ] Verify /room/:slug redirects to /poker/:slug
  - [ ] Test on mobile viewport
  - [ ] Document verification results

- [ ] **Task 6.3: Verify Component Structure**
  - [ ] Verify final component directory structure
  - [ ] Confirm shared/ contains all shared components
  - [ ] Confirm poker/ contains all poker-specific components
  - [ ] Verify no old component files remain in src/components/
  - [ ] Document final structure

- [ ] **Task 6.4: Conductor - User Manual Verification 'Phase 6' (Protocol in workflow.md)**

---

## Quality Gates

Before marking track complete, verify:

- [ ] All tests pass with >80% coverage
- [ ] Code follows project's code style guidelines
- [ ] All public functions/methods are documented
- [ ] Type safety maintained (100% TypeScript)
- [ ] No linting or static analysis errors
- [ ] Works correctly on mobile
- [ ] Documentation complete and accurate
- [ ] No security vulnerabilities introduced
- [ ] Backward compatibility maintained (redirects work)

---

**Plan Version:** 1.0  
**Created:** 2026-04-21  
**Last Updated:** 2026-04-21

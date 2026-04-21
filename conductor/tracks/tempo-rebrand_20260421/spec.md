# Specification: Tempo Rebranding & Multi-Tool Evolution

> **Track ID:** tempo-rebrand_20260421  
> **Type:** Feature (Rebranding + Architecture)  
> **Status:** New  
> **Created:** 2026-04-21

---

## 1. Overview

This track implements the comprehensive rebranding of the product from "Pointy Planning Poker" to "Tempo — Scrum Tools for Modern Teams", transitioning from a single-purpose planning poker application into a multi-tool scrum ceremony suite.

The rebranding preserves the existing tech stack (TanStack Start + Convex + Tailwind v4) and design aesthetic while establishing a neutral brand identity capable of supporting future scrum ceremony modules like standups and retrospectives.

### Key Changes

| Aspect        | Before                                                        | After                                 |
| ------------- | ------------------------------------------------------------- | ------------------------------------- |
| Product Name  | Pointy Planning Poker                                         | **Tempo**                             |
| Tagline       | "Real-time estimation. No accounts. No friction. Just point." | **"Scrum Tools for Modern Teams"**    |
| Logo Mark     | ◆ (diamond)                                                   | **◈ (diamond with dot)**              |
| URL Structure | `/room/:slug`                                                 | `/poker/:slug` (+ redirect)           |
| Architecture  | Single tool                                                   | Multi-tool with shared infrastructure |

---

## 2. Functional Requirements

### 2.1 Branding Updates

#### 2.1.1 Header Component

- **Location:** `src/components/Header.tsx`
- **Changes Required:**
  - Update logo from `◆` to `◈`
  - Change text from "Pointy" to "Tempo"
  - Add breadcrumb trail showing current tool context (e.g., "◈ Tempo ▸ Poker")
  - Update GitHub link from `mansyar/pointy-planning-poker` to `mansyar/tempo`

#### 2.1.2 Footer Component

- **Location:** `src/components/Footer.tsx`
- **Changes Required:**
  - Update copyright text from "© 2026 Pointy" to "© 2026 Tempo"

#### 2.1.3 Landing Page (Hub)

- **Location:** `src/components/LandingPage.tsx`
- **Changes Required:**
  - Update hero text from "Pointy Poker" to "Tempo"
  - Update tagline from "high-juice planning poker tool" to "Scrum Tools for Modern Teams"
  - Change CTA from "Create Master Room" to "Create Poker Room"
  - Reorganize into tool selector hub (Planning Poker + Future Tools)
  - Add "Coming Soon" badge for Daily Standup module

#### 2.1.4 HTML Meta Tags

- **Location:** `src/routes/__root.tsx` and route-specific meta
- **Changes Required:**
  - Update `<title>` tags across all pages
  - Update `og:title`, `og:description`, `description` meta tags
  - Ensure dynamic titles reflect "Tempo" branding

#### 2.1.5 PWA Manifest

- **Location:** `public/manifest.json`
- **Changes Required:**
  - Update `name` to "Tempo"
  - Update `short_name` to "Tempo"
  - Update `description` to "Scrum Tools for Modern Teams"
  - Update `theme_color` and `background_color`

#### 2.1.6 Favicon & Icons

- **Location:** `public/`
- **Changes Required:**
  - Replace favicon.ico with new ◈ logo
  - Update PWA icons (192x192, 512x512) with Tempo branding

### 2.2 Schema Migration

#### 2.2.1 Add `toolType` Field to Rooms Table

- **Location:** `convex/schema.ts`
- **Changes Required:**
  - Add `toolType` field to `rooms` table schema
  - Type: `v.union(v.literal('poker'), v.literal('standup'))`
  - Make optional initially for backward compatibility
  - Backfill all existing rooms with `toolType: 'poker'`

#### 2.2.2 Update Room Creation

- **Location:** `convex/rooms.ts`
- **Changes Required:**
  - Update `rooms.create` mutation to accept `toolType` parameter
  - Default to `'poker'` for existing calls
  - Update all client-side calls to room creation

### 2.3 Route Restructuring

#### 2.3.1 Add `/poker/:slug` Route

- **Location:** `src/routes/poker.$slug.tsx` (new file)
- **Changes Required:**
  - Create new route for poker rooms
  - Move existing poker room logic from `/room/:slug`
  - Use same `RoomPage` component but with poker-specific context

#### 2.3.2 Convert `/room/:slug` to Redirect

- **Location:** `src/routes/room.$slug.tsx` (existing)
- **Changes Required:**
  - Convert to redirect-only route
  - Redirect to `/poker/:slug` while preserving slug parameter
  - Maintain for at least 6 months for backward compatibility

#### 2.3.3 Update Room Creation Flow

- **Location:** `src/components/LandingPage.tsx`
- **Changes Required:**
  - Update navigation to use `/poker/:slug` route
  - Ensure old links still work via redirect

### 2.4 Component Architecture Refactoring

#### 2.4.1 Extract Shared Components

- **Target Directory:** `src/components/shared/`
- **Components to Move:**
  1. `AriaLiveAnnouncer.tsx` - Accessibility announcements
  2. `ClaimBanner.tsx` - Facilitator claim banner (generic)
  3. `EmojiActionBar.tsx` - Reaction UI (shared across tools)
  4. `EmojiBurst.tsx` - Reaction animations (shared)
  5. `Footer.tsx` - Global footer (branding)
  6. `Header.tsx` - Global header (navigation + branding)
  7. `InviteModal.tsx` - Room invitation (shared infrastructure)
  8. `JoinModal.tsx` - Join room flow (shared infrastructure)
  9. `JuiceToggle.tsx` - Settings toggle (shared)
  10. `OfflineBanner.tsx` - Connectivity status (shared)
  11. `PresenceSidebar.tsx` - Player presence list (shared infrastructure)
  12. `SectionErrorBoundary.tsx` - Error handling (shared)
  13. `ThemeToggle.tsx` - Theme switching (shared)
  14. `LandingPage.tsx` - Hub page (shared entry point)

#### 2.4.2 Create Poker-Specific Components Directory

- **Target Directory:** `src/components/poker/`
- **Components to Move:**
  1. `ActiveTopicHeader.tsx` - Poker topic header
  2. `BatchAddModal.tsx` - Poker topic batch management
  3. `CardDeck.tsx` - Poker card deck (Fibonacci scale)
  4. `CardGrid.tsx` - Poker card grid layout
  5. `ConfirmEstimateModal.tsx` - Poker final estimate confirmation
  6. `MobileController.tsx` - Poker mobile controller mode
  7. `PokerCard.tsx` - Individual poker card component
  8. `RoomPage.tsx` - Poker room page (refactor as poker-specific)
  9. `RoomSettingsModal.tsx` - Poker room settings
  10. `RoundTimer.tsx` - Poker round timer
  11. `StatsPanel.tsx` - Poker statistics panel
  12. `TopicSidebar.tsx` - Poker topic queue

#### 2.4.3 Update Imports

- **Scope:** All files in `src/` and `tests/`
- **Changes Required:**
  - Update component imports to new paths
  - Update test imports to match new structure
  - Ensure no breaking changes to component APIs

### 2.5 Documentation Updates

#### 2.5.1 README.md

- **Changes Required:**
  - Update project title from "Pointy Planning Poker" to "Tempo"
  - Update description to reflect multi-tool vision
  - Update installation/usage instructions if needed
  - Update GitHub repository references

#### 2.5.2 Design System (DESIGN_SYSTEM.md)

- **Changes Required:**
  - Update title to "Design System: Tempo"
  - Update component inventory to reflect new structure
  - Add tool selector hub wireframe
  - Update landing page wireframe

#### 2.5.3 PRD Documents

- **Changes Required:**
  - `PRD.md`: Add umbrella PRD for Tempo with multi-tool architecture
  - `PRD_POKER.md`: Rename/update with module header
  - `PRD_STANDUP.md`: Create new module PRD (if not exists)

---

## 3. Non-Functional Requirements

### 3.1 Performance

- No performance degradation from refactoring
- Component extraction should improve bundle organization
- Lazy loading preserved for heavy components

### 3.2 Type Safety

- 100% TypeScript coverage maintained
- No type errors from import path changes
- Component APIs remain unchanged

### 3.3 Testing

- All existing tests must pass
- Component tests updated to reflect new import paths
- No test coverage regression

### 3.4 Backward Compatibility

- `/room/:slug` redirects must work for at least 6 months
- Existing shared room links must continue functioning
- No data loss or schema corruption during migration

### 3.5 Accessibility

- All accessibility features preserved
- ARIA labels and announcements unchanged
- Keyboard navigation maintained

---

## 4. Acceptance Criteria

### 4.1 Branding Updates

- [ ] All UI text says "Tempo" instead of "Pointy"
- [ ] Logo mark updated to ◈ throughout application
- [ ] Header shows "◈ Tempo" branding
- [ ] Footer shows "© 2026 Tempo"
- [ ] Meta tags updated with Tempo branding
- [ ] PWA manifest updated with Tempo metadata
- [ ] Favicons and icons updated

### 4.2 Landing Page Hub

- [ ] Landing page redesigned as tool selector hub
- [ ] Hero text updated to "Tempo — Scrum Tools for Modern Teams"
- [ ] Poker tool available with "Create Poker Room" CTA
- [ ] Standup tool shown with "Coming Soon" badge

### 4.3 Schema Migration

- [ ] `toolType` field added to rooms table
- [ ] All existing rooms backfilled with `toolType: 'poker'`
- [ ] Room creation accepts `toolType` parameter
- [ ] No data corruption or loss during migration

### 4.4 Route Restructuring

- [ ] `/poker/:slug` route serves poker experience
- [ ] `/room/:slug` redirects to `/poker/:slug`
- [ ] Redirect preserves slug parameter
- [ ] Existing shared links work via redirect

### 4.5 Component Architecture

- [ ] Shared components extracted to `components/shared/`
- [ ] Poker components moved to `components/poker/`
- [ ] All imports updated correctly
- [ ] No component API changes
- [ ] Component tests pass with new paths

### 4.6 Documentation

- [ ] README.md updated with Tempo branding
- [ ] DESIGN_SYSTEM.md updated with new structure
- [ ] PRD.md created as umbrella document
- [ ] PRD_POKER.md updated with module header
- [ ] REBRANDING.md exists and documents changes

### 4.7 Testing

- [ ] All existing tests pass
- [ ] No test coverage regression
- [ ] Component tests updated for new paths

### 4.8 Verification

- [ ] Manual verification: Visit `/room/:slug` redirects to `/poker/:slug`
- [ ] Manual verification: New room creation works with new branding
- [ ] Manual verification: Existing rooms still accessible

---

## 5. Out of Scope

### 5.1 Not Included in This Track

- **Daily Standup Module Implementation:** Only rebranding setup, not feature development
- **Retrospective Module:** Future track
- **Velocity Dashboard:** Future track
- **New Features:** Any new poker features beyond rebranding
- **Performance Optimizations:** Beyond scope of refactoring
- **User Migration:** No user-facing migration required (ephemeral data)

### 5.2 Assumptions

- Existing `RoomPage.tsx` component can be adapted for `/poker/:slug` route
- All shared infrastructure (players, presence, reactions) works across tools
- Convex schema migration pattern will work as documented in REBRANDING.md

### 5.3 Dependencies

- None (self-contained track)
- Note: Standup module will depend on this track being complete

---

## 6. Technical Notes

### 6.1 Convex Schema Migration Pattern

Follow the widen-migrate-narrow pattern from REBRANDING.md:

1. **Widen:** Add optional `toolType` field
2. **Migrate:** Backfill all existing rooms
3. **Narrow:** Make `toolType` required (in future track)

### 6.2 Route Pattern

```
/poker/:slug     → PokerRoomPage (new)
/room/:slug      → Redirect to /poker/:slug
```

### 6.3 Component Structure

```
src/components/
├── shared/           ← Shared across all tools
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── poker/            ← Poker-specific
│   ├── PokerCard.tsx
│   ├── CardDeck.tsx
│   └── ...
└── (old structure)   ← To be migrated
```

### 6.4 Test Coverage

All component tests must be updated to reflect new import paths:

- `import { Header } from '../components/Header'` → `import { Header } from '../components/shared/Header'`
- `import { PokerCard } from '../components/PokerCard'` → `import { PokerCard } from '../components/poker/PokerCard'`

---

**Specification Version:** 1.0  
**Last Updated:** 2026-04-21  
**Approved By:** [Pending user confirmation]

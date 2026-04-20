# Rebranding: Pointy Planning Poker → Tempo

> **Date:** 2026-04-21  
> **Status:** Planned

---

## 1. What Is Changing

The product is being rebranded and expanded:

| Aspect              | Before                                                        | After                                     |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| **Name**            | Pointy Planning Poker                                         | **Tempo**                                 |
| **Tagline**         | "Real-time estimation. No accounts. No friction. Just point." | **"Scrum Tools for Modern Teams"**        |
| **Scope**           | Single tool (Planning Poker)                                  | Multi-tool scrum ceremony toolkit         |
| **Logo mark**       | ◆ (diamond)                                                   | ◈ (diamond with dot)                      |
| **Identity**        | Planning poker app                                            | Scrum ceremony companion suite            |
| **URL structure**   | `/room/:slug`                                                 | `/poker/:slug`, `/standup/:slug` (future) |
| **Repository name** | `pointy-planning-poker`                                       | **tempo**                                 |
| **Package name**    | `pointy-planning-poker`                                       | **tempo**                                 |

### What Is NOT Changing

| Aspect                 | Status                                                       |
| ---------------------- | ------------------------------------------------------------ |
| **Tech stack**         | Same — TanStack Start + Convex + Tailwind v4 + Framer Motion |
| **Design aesthetic**   | Same — "Modern Corporate", Linear/Vercel-inspired            |
| **Color palette**      | Same — dark/light mode tokens unchanged                      |
| **Typography**         | Same — Inter + JetBrains Mono                                |
| **Core philosophy**    | Same — no accounts, ephemeral, real-time first               |
| **Deployment**         | Same — Coolify + Convex Cloud                                |
| **Existing features**  | All preserved — Planning Poker becomes Module 1              |
| **Codebase structure** | Components extracted, routes restructured                    |

## 2. Why Rebrand

### The Trigger

The product is expanding from a single planning poker tool into a multi-tool scrum ceremony suite. The name "Pointy Planning Poker" is too specific — it can't credibly encompass a standup timer or retrospective board.

### The Rationale

1. **Name scoping:** "Planning Poker" pigeonholes the product into one ceremony. The expanded product covers standups, estimation, and (eventually) retros. It needs a name that's neutral across all.

2. **"Tempo" fits the product metaphor:**
   - Sprints are about **cadence** — regular rhythms of ceremonies.
   - Standups have a **beat** — timeboxed speaker rotations.
   - Estimation has a **rhythm** — vote → reveal → discuss → repeat.
   - "Tempo" captures the idea of **keeping the team in sync**, which is exactly what every scrum ceremony does.

3. **Brand simplicity:** One word, five letters, universally pronounceable. Works as a standalone brand without needing "Scrum" or "Agile" in the name.

4. **Design fit:** "Tempo" pairs well with the existing Linear/Vercel-inspired aesthetic — it's clean, modern, and professional without being playful or childish.

## 3. The Name: Tempo

### Brand Attributes

| Attribute        | Description                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| **Meaning**      | Musical term for the speed/rhythm of a piece — evokes cadence, synchronization, flow |
| **Tone**         | Professional, modern, concise                                                        |
| **Memorability** | One word, easy to type, easy to say in any language                                  |
| **Associations** | Speed, rhythm, coordination, teamwork                                                |

### Brand Elements

| Element                | Value                                            | Notes                                                 |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| **Logo mark**          | ◈                                                | Diamond with center dot — evolution of the original ◆ |
| **Full lockup**        | ◈ Tempo                                          | Used in header/nav                                    |
| **Tagline**            | Scrum Tools for Modern Teams                     | Used on landing page, meta descriptions               |
| **In-room breadcrumb** | ◈ Tempo ▸ Planning Poker ▸ `slug`                | Shows tool context within the product                 |
| **Favicon**            | ◈ in accent color (#818CF8 dark / #6366F1 light) | Consistent with existing accent                       |

### URL Structure

```
Old:   example.com/room/clumsy-tiger-22
New:   example.com/poker/clumsy-tiger-22     ← Planning Poker
       example.com/standup/swift-falcon-17    ← Daily Standup
```

A redirect from `/room/:slug` → `/poker/:slug` preserves backward compatibility for shared links.

## 4. Scope of Changes

### 4.1 Code Changes

| Area                    | Change                                                                | Impact |
| ----------------------- | --------------------------------------------------------------------- | ------ |
| **Landing page**        | Rebrand hero text, evolve from single CTA to tool selector hub        | High   |
| **Header component**    | "◆ Pointy" → "◈ Tempo", add tool breadcrumb                           | Low    |
| **Footer component**    | "© 2026 Pointy" → "© 2026 Tempo"                                      | Low    |
| **HTML `<title>` tags** | "Pointy Planning Poker" → "Tempo — Scrum Tools"                       | Low    |
| **Meta tags**           | Update `og:title`, `og:description`, `description`                    | Low    |
| **PWA manifest**        | Update `name`, `short_name`, `description`                            | Low    |
| **Route structure**     | `/room/:slug` → `/poker/:slug` + add redirect                         | Medium |
| **Room creation flow**  | Add `toolType` parameter to room creation                             | Medium |
| **Schema migration**    | Add `toolType` field to `rooms` table, backfill existing as `'poker'` | Medium |

### 4.4 SEO Strategy

To maintain and improve search visibility during and after the rebrand:

**Landing Page (`/`)**

- **Title:** "Tempo — Scrum Tools for Modern Teams"
- **Description:** "Real-time planning poker for agile teams. No accounts. No friction. Join with a nickname and start estimating instantly. More tools coming soon."
- **Canonical:** `https://tempo.example.com/` (use your actual domain)
- **Open Graph:** Use a branded OG image with the ◈ logo.

**Room Pages (`/poker/:slug`, `/standup/:slug`)**

- **Title:** "{Room Name} | Tempo Poker" (e.g., "clumsy-tiger-22 | Tempo Poker")
- **Description:** "Join {Room Name} on Tempo for real-time estimation. Click to join as {Participant Count} player(s) are waiting."
- **Canonical:** Dynamic per slug (e.g., `https://tempo.example.com/poker/clumsy-tiger-22`) to avoid duplicate content issues.
- **Structured Data:** Add `WebApplication` schema on landing. Consider `Event` schema for active rooms (experimental).

**Technical SEO**

- Ensure `robots.txt` allows indexing of room pages (slugs are "pseudo-private" but should be crawlable).
- Use `<link rel="canonical">` to prevent duplicate content if you support both `/room/` and `/poker/` paths via redirect.
- Update `sitemap.xml` (if generated) to reflect new routes.

### 4.2 Documentation Changes

| Document                | Change                                             |
| ----------------------- | -------------------------------------------------- |
| `docs/PRD.md`           | **New** — Umbrella product PRD for Tempo           |
| `docs/PRD_POKER.md`     | **Renamed** from `PRD.md`, added module header     |
| `docs/PRD_STANDUP.md`   | **New** — Standup timer module PRD                 |
| `docs/DESIGN_SYSTEM.md` | **Updated** — Title, hub wireframe, new components |
| `docs/REBRANDING.md`    | **New** — This document                            |

### 4.3 Asset Changes

| Asset                        | Change                                       |
| ---------------------------- | -------------------------------------------- |
| Favicon                      | Update to ◈ mark                             |
| PWA icons (192x192, 512x512) | Update to Tempo branding                     |
| OG image                     | New social sharing image with Tempo branding |
| README.md                    | Update project description and title         |

## 5. Migration Strategy

### For the Codebase

0. **Repository Rename:**
   - Rename GitHub repository: `pointy-planning-poker` → `tempo`
   - Locally, update remote URL:
     ```bash
     git remote set-url origin git@github.com:yourusername/tempo.git
     ```
   - Update `package.json` name to `tempo` (if referenced).
   - Update any CI/CD webhooks or GitHub Actions referencing the old name.

1. **Schema migration:** Use the widen-migrate-narrow pattern:
   - **Current state:** `rooms` table has no `toolType` field (poker-only schema)
   - **Widen:** Add optional `toolType` field to rooms schema (`'poker' | 'standup'`)
   - **Migrate:** Backfill all existing rooms with `toolType: 'poker'`
   - **Narrow:** Make `toolType` required (after backfill complete)

2. **Route migration:**
   - Add new `/poker/:slug` route (same component as current `/room/:slug`)
   - Convert `/room/:slug` to a redirect route
   - Keep redirect for at least 6 months

3. **Component refactoring:**
   - Extract shared components (Header, Footer, JoinModal, etc.) into `components/shared/`
   - Move poker-specific components into `components/poker/`
   - Update imports throughout

### For Users

- **Zero disruption:** Existing shared room links (`/room/clumsy-tiger-22`) continue to work via redirect.
- **No data loss:** The planning poker experience is identical — it's just under a new URL and brand.
- **Progressive discovery:** Returning users see the new hub landing page and discover the standup timer alongside the familiar poker tool.

## 6. Timeline

This rebrand is implemented as **Phase 1** of the Tempo evolution, before any new tools are built:

| Step      | Task                                                     | Effort           |
| --------- | -------------------------------------------------------- | ---------------- |
| 1         | Update branding (header, footer, titles, meta, manifest) | 1 day            |
| 2         | Schema migration (add `toolType` to rooms)               | 1 day            |
| 3         | Route restructure (`/room` → `/poker` + redirect)        | 1 day            |
| 4         | Extract shared components into `components/shared/`      | 2–3 days         |
| 5         | Redesign landing page as tool-selector hub               | 2–3 days         |
| 6         | Update design system documentation                       | 1 day            |
| 7         | Update favicons, PWA manifest, OG images                 | 1 day            |
| **Total** |                                                          | **~1.5–2 weeks** |

## 7. Success Criteria

The rebrand is complete when:

- [ ] All UI text says "Tempo" instead of "Pointy"
- [ ] Landing page shows tool selector hub with at least Planning Poker
- [ ] Route `/poker/:slug` serves the planning poker experience
- [ ] Route `/room/:slug` redirects to `/poker/:slug`
- [ ] **Redirect Verified:** Manually verify that visiting a legacy link (e.g., `example.com/room/clumsy-tiger-22`) redirects correctly to `example.com/poker/clumsy-tiger-22` in the browser.
- [ ] Rooms table has `toolType` field, all rooms typed as `'poker'`
- [ ] PWA manifest, favicons, and meta tags updated
- [ ] Shared components extracted into `components/shared/`
- [ ] All existing tests still pass
- [ ] Existing shared room links still work via redirect
- [ ] Repository renamed to `tempo` (local & GitHub)

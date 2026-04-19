# Technology Stack: Pointy Planning Poker

## Core Technologies

- **Language:** TypeScript (100% end-to-end type safety from DB to UI components).
- **Framework:** TanStack Start (Beta/Latest) - Provides SSR, type-safe routing, and Vite-based bundling.
- **Backend & Database:** Convex - Managed real-time document store, mutations, scheduled functions, and cron jobs.
- **Unique Name Generation:** `unique-names-generator` for human-readable room slugs (used in Convex).

## Frontend UI & Styling

- **Styling:** Tailwind CSS v4 - Utility-first styling with great DX for glassmorphism and modern aesthetics.
- **Animation:** Framer Motion - Powers 3D card transforms, spring physics, and layout animations.
- **Notifications:** `sonner` - Global toast system for unified user feedback.
- **Sharing:** `qrcode.react` - Generating scan-able room links for mobile transition.
- **State Management:**
  - **UI State:** TanStack Search Params (URL-shareable state).
  - **Session Identity:** `localStorage` for maintaining persistent player status without a backend login.

## Infrastructure & Deployment

- **Hosting (Frontend):** Private VPS managed by Coolify (Dockerized Node.js server).
- **Hosting (Backend):** Convex Cloud (managed service).
- **PWA Support:** Web Manifest and Service Workers to enable a standalone mobile "controller" experience.
- **Package Manager:** pnpm.

## Quality Gates & Tooling

- **Linting:** ESLint (v10+, flat configuration) for code quality and consistency.
- **Formatting:** Prettier for automated code formatting.
- **Type Checking:** TypeScript (`tsc --noEmit`) to verify structural integrity.
- **Testing:** Vitest for unit and integration testing.
- **Git Hooks:** Husky and lint-staged to enforce quality checks on commit and push.
- **Quality Requirements:** >80% code coverage; max 500 lines per file in core directories.

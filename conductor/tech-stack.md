# Technology Stack: Tempo

## Core Framework

- **Framework:** [TanStack Start](https://tanstack.com/start) (Latest) - Provides SSR, type-safe routing, and Vite-based bundling.
- **Backend & Database:** [Convex](https://convex.dev/) - Managed real-time document store, mutations, scheduled functions, and cron jobs.
- **Language:** TypeScript (100% end-to-end type safety from DB to UI components).

## Frontend UI & Styling

- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first styling with CSS-first configuration and modern DX.
- **Animation:** [Framer Motion](https://www.framer.com/motion/) - Powers 3D transforms, spring physics, and layout animations.
- **Icons:** [Lucide React](https://lucide.dev/) - Modern, consistent icon set.
- **Notifications:** `sonner` - Global toast system for unified user feedback.
- **Sharing:** `qrcode.react` - Generating scan-able room links for mobile transition.

## State & Architecture

- **Multi-Tool Architecture:** Polymorphic room model using a `toolType` discriminator to support multiple ceremony modules (Poker, Standup).
- **UI State:** TanStack Search Params (URL-shareable state).
- **Session Identity:** `localStorage` for maintaining persistent player status via local `identityId`.
- **Identity Synchronization:** Secure token protocol for cross-device identity mirroring.

## Infrastructure & Deployment

- **Hosting (Frontend):** Private VPS managed by Coolify (Dockerized Node.js server).
- **Hosting (Backend):** Convex Cloud (managed service).
- **PWA Support:** Web Manifest and Service Workers to enable standalone mobile experiences.
- **Package Manager:** pnpm.

## Quality Gates & Tooling

- **Testing:** Vitest for unit and integration testing.
- **Quality Requirements:** >80% code coverage; max 500 lines per file in core directories.
- **Verification:** ESLint (flat config), Prettier, Husky (git hooks).

# Specification: Setup Project Infrastructure and Anonymous Room Creation

## Objective
Establish the foundational project scaffolding, including the TanStack Start and Convex integration, and implement the core "anonymous room creation" flow.

## Requirements
1. **Scaffolding:** Initialize a TanStack Start application with TypeScript and Tailwind CSS v4.
2. **Backend Integration:** Configure Convex with the basic schema (`rooms` and `players`).
3. **Landing Page:** Create the home page (`/`) with a "Create Room" CTA.
4. **Room Route:** Create the dynamic room route (`/room/:slug`) with a basic join modal that captures the user's nickname and saves it in `localStorage`.

## Success Criteria
* TanStack Start development server runs without errors.
* Convex backend is linked and successfully creates room documents via a mutation.
* A user can click "Create Room" on the landing page, be redirected to a new room slug, enter their nickname, and be recorded as a Player in the Convex database.
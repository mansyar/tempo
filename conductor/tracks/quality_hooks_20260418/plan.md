# Implementation Plan: Setup pre-commit and pre-push checks

## Phase 1: Setup Tooling
- [x] Task: Install `husky` and `lint-staged` as dev dependencies using pnpm. 071bee1
- [ ] Task: Add quality check scripts to `package.json`.
    - [ ] `lint`: `eslint .`
    - [ ] `format`: `prettier --check .`
    - [ ] `typecheck`: `tsc --noEmit`
    - [ ] `test:coverage`: `vitest run --coverage`
- [ ] Task: Create `scripts/check-file-length.ts` to verify file line counts.
    - [ ] Implement logic to scan `src/` and `convex/` (excluding `_generated/`).
    - [ ] Add check for > 500 lines.
    - [ ] Add refactor suggestion message on failure.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup Tooling' (Protocol in workflow.md)

## Phase 2: Configure Git Hooks
- [ ] Task: Initialize `husky` in the project.
- [ ] Task: Configure `lint-staged` in `package.json` or `.lintstagedrc`.
    - [ ] Run `eslint`, `prettier`, `typecheck`, and `vitest related --run` on staged files.
    - [ ] Run `scripts/check-file-length.ts` on staged files.
- [ ] Task: Create `.husky/pre-commit` hook to run `lint-staged`.
- [ ] Task: Create `.husky/pre-push` hook to run `pnpm run test:coverage`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Configure Git Hooks' (Protocol in workflow.md)

## Phase 3: Final Validation
- [ ] Task: Verify pre-commit fails on linting error.
- [ ] Task: Verify pre-commit fails on file length > 500 lines.
- [ ] Task: Verify pre-push fails on low test coverage (< 80%).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Validation' (Protocol in workflow.md)

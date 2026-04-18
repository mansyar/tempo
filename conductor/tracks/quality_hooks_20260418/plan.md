# Implementation Plan: Setup pre-commit and pre-push checks

## Phase 1: Setup Tooling [checkpoint: 358bf9f]

- [x] Task: Install `husky` and `lint-staged` as dev dependencies using pnpm. 071bee1
- [x] Task: Add quality check scripts to `package.json`. cf3ec9a
  - [x] `lint`: `eslint .`
  - [x] `format`: `prettier --check .`
  - [x] `typecheck`: `tsc --noEmit`
  - [x] `test:coverage`: `vitest run --coverage`
- [x] Task: Create `scripts/check-file-length.ts` to verify file line counts. 35ecf88
  - [x] Implement logic to scan `src/` and `convex/` (excluding `_generated/`).
  - [x] Add check for > 500 lines.
  - [x] Add refactor suggestion message on failure.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup Tooling' (Protocol in workflow.md) 358bf9f

## Phase 2: Configure Git Hooks

- [x] Task: Initialize `husky` in the project. 3b5fb2e
- [x] Task: Configure `lint-staged` in `package.json` or `.lintstagedrc`. 6e08123
  - [x] Run `eslint`, `prettier`, `typecheck`, and `vitest related --run` on staged files.
  - [x] Run `scripts/check-file-length.ts` on staged files.
- [x] Task: Create `.husky/pre-commit` hook to run `lint-staged`. 6e08123
- [x] Task: Create `.husky/pre-push` hook to run `pnpm run test:coverage`. d7dc0eb
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Configure Git Hooks' (Protocol in workflow.md)

## Phase 3: Final Validation

- [ ] Task: Verify pre-commit fails on linting error.
- [ ] Task: Verify pre-commit fails on file length > 500 lines.
- [ ] Task: Verify pre-push fails on low test coverage (< 80%).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Validation' (Protocol in workflow.md)

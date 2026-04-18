# Specification: Setup pre-commit and pre-push checks

## Overview

This track aims to implement automated quality gates using Git hooks to ensure code quality and test coverage before code is committed or pushed.

## Functional Requirements

- **Pre-commit Hook:**
  - Run ESLint to check for code smells.
  - Run Prettier to ensure consistent formatting.
  - Run TypeScript compiler (`tsc`) to verify type safety.
  - Run Vitest for tests related to staged files.
  - **File Length Check:** Execute a script to ensure no file in `src/` or `convex/` (excluding `_generated/`) exceeds 500 lines. If a file exceeds this limit, fail the commit and prompt the user to refactor.
- **Pre-push Hook:**
  - Run full test suite with Vitest.
  - Verify that test coverage is at least 80% (global or per file as per project standards).

## Non-Functional Requirements

- **Performance:** Hooks should run as quickly as possible (lint-staged for pre-commit).
- **Reliability:** Hooks must reliably fail the git operation if checks do not pass.

## Acceptance Criteria

- [ ] Attempting to commit code with linting/formatting/type errors or failing tests fails the commit.
- [ ] Attempting to commit a file in `src/` or `convex/` (excluding `_generated/`) that exceeds 500 lines fails the commit with a refactor suggestion.
- [ ] Attempting to push code with total coverage below 80% fails the push.
- [ ] `husky` and `lint-staged` are properly configured in `package.json`.

## Out of Scope

- Implementing new tests to reach the 80% threshold (this track only sets up the check).

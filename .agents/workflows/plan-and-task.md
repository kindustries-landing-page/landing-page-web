---
description: Klotus Landing Web implementation planning workflow
---

# Klotus Landing Web Plan & Task

Use this workflow for features, refactors, and bug fixes in the Klotus Web application.

## Phase 1: Discovery

- Confirm repository, branch `master`, and runtime configuration.
- Read the Web router, current-truth skill, README, route, component, hook, and API contract.
- Identify responsive, accessibility, i18n, and server-state requirements.

## Phase 2: Technical Plan

Document route wiring, component boundaries, React Query hooks, translations, responsive behavior,
error/loading states, and the API handoff.

## Phase 3: Atomic Tasks

Break work into `X.Y.Z` tasks. Keep each task to one or two files and provide a scoped
verification command. UI tests use co-located Vitest specs where applicable.

## Phase 4: Approval Gate

Record breaking changes and open questions. Do not modify application code or run test
commands until the plan is approved.

## Phase 5: Execution and QC

Execute one active task at a time, update the plan after each passing scoped test, then run:

```bash
bun run build
bun run check:ci
bun run test
```

Update the affected skill/current-truth documentation when routes, components, state, or API contracts change.

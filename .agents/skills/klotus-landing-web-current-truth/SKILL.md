---
name: klotus-landing-web-current-truth
description: Web-specific local-only skill for Klotus Landing Page Web. Use when working in this repo to load the repo-local current-truth context and implementation rules without relying on external docs.
---

# Klotus Landing Page Web Current-Truth

Use this skill only inside this repository (`./landing-page-web`).

## Local read order

1. `@.agents/AGENTS.md`
2. `@README.md`
3. Antigravity Brain (`implementation_plan.md` & `walkthrough.md`)

## Current truth

- Main branch = `master`, Remote = `github-industries`
- Framework = React 19 + Vite 6 + TailwindCSS v4 + Base UI
- Runtime & Package Manager = `bun` / `bunx`
- Scope: Landing page UI, warranty verification & activation funnel, responsive mobile & desktop UX.

## Working rules

- Follow Atomic Design: split files larger than ~200 lines.
- Reuse Base UI and existing components in `src/components/`.
- Manage server state with TanStack Query.
- Unit testing with Vitest.
- Follow Strict Git Workflow: `build -> check:ci -> test -> commit -> push`.

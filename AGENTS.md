# Klotus Landing Page Web Agent Entry

This file is the root entry point for AI agents in `landing-page-web`.

## Mandatory Implementation Authority

The canonical source of truth and full rules for this repository are defined in:
👉 [`.agents/AGENTS.md`](./.agents/AGENTS.md)

## Core Guardrails Summary

1. **Tech Stack**: React 19 + Vite 6 + TailwindCSS v4 + Base UI + TanStack Query + Motion + Sonner + i18next + Vitest.
2. **Tooling**: Use `bun` / `bunx` exclusively (do NOT use `npm` or `yarn`).
3. **UI Patterns & Reusability**: Maximize reusability of existing UI components and Base UI primitives; do not build duplicate UI widgets from scratch.
4. **Git Operations**: All git commands MUST be run inside `./landing-page-web`. Remote is `github-industries`, branch is `master`.
5. **Strict Pre-push Mandate**: Before commit/push, you MUST run `bun run build`, `bun run check:ci`, and `bun run test`.

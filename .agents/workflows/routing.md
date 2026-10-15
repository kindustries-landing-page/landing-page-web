---
description: Klotus Landing Web scope routing
---

# Klotus Landing Web Routing

## Scope

This workflow applies only to `klotus/landing-page-web`.

## Read Order

1. Workspace `.agents/AGENTS.md`
2. `klotus/.agents/AGENTS.md`
3. This repository's `.agents/AGENTS.md`
4. `SKILL.md` referenced by the repository router
5. The relevant workflow and `README.md`

## Boundaries

- Use only the Klotus Web API contract and Klotus runtime configuration.
- Do not edit ERP Web or ERP API code as part of a Klotus Web task.
- Use `@tanstack/react-query` for server state and the existing i18n setup for user-facing copy.
- Use `bun`/`bunx`; do not use `npm` or `yarn`.

## Delivery Handoff

Confirm the API contract from `landing-page-api` before implementing a dependent UI flow.
Run Web verification from this repository root and use branch `master` with remote `github-industries`.

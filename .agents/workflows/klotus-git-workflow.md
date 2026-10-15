---
description: Klotus Landing Web Git workflow
---

# Klotus Landing Web Git Workflow

## Repository Guardrails

- Run every Git command inside `klotus/landing-page-web`.
- Main branch is `master`.
- Primary remote is `github-industries`; use `origin` only when that remote is unavailable.
- Never mix Klotus environment files, API contracts, or deployment settings with ERP.

## Commit

Before committing, run in order:

```bash
bun run build
bun run check:ci
bun run test
git commit -m "<type>(web): <message>"
```

## Pull and Push

Pull with:

```bash
git pull --rebase github-industries master
```

Before pushing, repeat build, check, and test, then run:

```bash
git push github-industries master
```

Do not push when any verification command fails.

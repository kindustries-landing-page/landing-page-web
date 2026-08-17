# Klotus Landing Page Web Agent Bootstrap

Source of truth for this repository (`./landing-page-web`).

## Read order

1. `.agents/skills/klotus-landing-web-current-truth/SKILL.md`
2. `README.md`
3. Antigravity Brain (`implementation_plan.md` & `walkthrough.md`)

---

## Web Specific Agent Mandates

### 1. UI Reusability Enforcer (Anti-Reinvention)

- **CRITICAL:** Do NOT build basic UI components from scratch.
- Use `@base-ui/react`, existing components in `src/components/`, or TailwindCSS v4 utilities.
- If a component already exists, inspect its interface/props and reuse it.

### 2. Atomic Design & Clean Code

- **Max File Size:** Any React component file exceeding ~200 lines MUST be split.
- Extract complex business/API logic into custom hooks under `src/hooks/` or `src/lib/`.
- Extract sub-components into dedicated files. Do NOT bundle multiple large components into a single file.

### 3. Server State Management (React Query Mandate)

- Use `@tanstack/react-query` (`useQuery`, `useMutation`, `useQueryClient`) for server state.
- **NEVER** use raw `useEffect` + `fetch/axios` for manual asynchronous server state management.

### 4. Web Auto-TDD (Vitest)

- After creating or modifying a core helper, hook, or critical UI component, you **MUST** generate/update a corresponding `.test.tsx` or `.test.ts` file.
- Run tests via `bun run test`.

### 5. i18n Translation Mandate

- You **MUST** use the project's `i18next` / `react-i18next` translation setup for user-facing copy.
- Do NOT hardcode raw copy where translations are expected.

### 6. Strict Pre-push Hook

- Before running `git push`, you **MUST** run `bun run build`, `bun run check:ci`, and `bun run test`.
- Do NOT push if any of these commands fail.

### 7. Rebase First Conflict Resolution

- When pulling or pushing code, your **first priority** is to use `git pull --rebase github-industries master`.
- Only if the rebase presents overly complex conflicts, you may `git rebase --abort` and resolve using a standard merge.

---

## Current Truth

- Main branch: **`master`**
- Remote: **`github-industries`**
- App role:
  - Public Warranty Landing Page (`/bao-hanh`, QR check, warranty activation).
  - Production targets: host `Head-Liouni`, domain `klotus.liouni.com`, API `api.klotus.vn`.

---

## Git Workflow Mandates

When asked to **commit code**, you MUST execute the following in order:

1. `bun run build`
2. `bun run check:ci`
3. `bun run test`
4. `git commit -m "<type>(<scope>): <message>"`

When asked to **pull code**, you MUST execute the following in order:

1. If there are uncommitted changes, save/commit them first.
2. `git pull --rebase github-industries master` (and resolve conflicts if any)

When asked to **push code**, you MUST execute the following in order:

1. If there are uncommitted changes, save/commit them first.
2. `git pull --rebase github-industries master` (and resolve conflicts if any)
3. `bun run build`
4. `bun run check:ci`
5. `bun run test`
6. `git push github-industries master`

**Git Execution Context**: You MUST perform all Git operations exclusively inside the `landing-page-web` directory. NEVER run git commands from the workspace root.

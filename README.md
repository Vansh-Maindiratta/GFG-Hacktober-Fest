# GEEKSTOBER — Competition Portal

An **open-source contribution competition** portal: participants sign in with GitHub, pick a
repository, claim a problem statement, ship a pull request, and earn XP, badges and leaderboard
rank for effective, reviewed, merged work.

> Code. Contribute. Compete.

---

## Stack

| Layer     | Choice                                             |
| --------- | -------------------------------------------------- |
| UI        | React 19 + TypeScript (strict) + Vite              |
| Styling   | Tailwind CSS v4 (design tokens in `src/index.css`) |
| Routing   | React Router (lazy-loaded, guarded routes)         |
| Data      | TanStack Query                                     |
| Forms     | React Hook Form + Zod                              |
| Charts    | Recharts                                           |
| Animation | Framer Motion                                      |
| Toasts    | Sonner                                             |
| Icons     | Lucide React                                       |
| Backend   | MongoDB + Express (separate service)               |

## Getting started

```bash
npm install
cp .env.example .env      # optional — the app runs fully on mock data without it
npm run dev               # http://localhost:5173
```

Scripts: `npm run dev` · `npm run build` (typecheck + bundle) · `npm run lint` · `npm run preview`

### Environment

| Variable              | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `VITE_API_BASE_URL`   | Express/MongoDB API base. Empty ⇒ local mock data layer.      |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth App client id — enables real “Continue with GitHub”. The client secret stays on the backend. |

## Routes

| Route                          | Purpose                                            |
| ------------------------------ | -------------------------------------------------- |
| `/`                            | Landing page: hero, stats, workflow, showcase      |
| `/projects`                    | Project / problem-statement registry with filters  |
| `/projects/:slug`              | Project detail: issues, guidelines, history        |
| `/leaderboard`                 | Overall / weekly / project standings + podium      |
| `/rules`                       | Official scoring table + XP calculator             |
| `/badges`                      | Achievement catalogue                              |
| `/how-it-works`                | Contribution lifecycle and verification flow       |
| `/about`                       | Event, values, timeline                            |
| `/login`                       | Geekstober authentication portal (GitHub) — public |
| `/auth/github/callback`        | OAuth redirect target — exchanges the code         |
| `/profile/:username`           | Public participant profile                         |
| `/dashboard`                   | Participant workspace (**auth-gated**)             |
| `/progress`                    | Stage tracker: issue → fork → PR → points (**auth-gated**) |
| `/admin`                       | Admin overview (**admin-gated**)                   |
| `/admin/projects`              | Repository management: add, edit, search, filter, deactivate |
| `/admin/problem-statements`    | Issue management (Zod-validated, confirm-on-delete) |
| `/admin/participants`          | Participant table                                  |
| `/admin/contributions`         | Review queue — award or reject the official XP     |
| `/admin/scoring`               | Scoring configuration (official XP values locked)  |
| `/admin/github`                | GitHub App / webhook integration status            |
| `/admin/settings`              | Event configuration                                |

## Authentication & authorization

The navbar’s GitHub icon opens the **Geekstober login portal** (it never links straight to a
repository). The portal starts the GitHub OAuth flow:

```
GitHub icon → /login → GitHub authorize → /auth/github/callback
           → backend verifies code, resolves role (participant | admin)
           → session persisted → participant dashboard / admin console
```

- Two roles: `PARTICIPANT` and `ADMIN`. `/dashboard` and `/progress` require a session; `/admin/*`
  additionally requires the admin role (`src/routes/RequireAuth.tsx`).
- The backend re-checks every protected API call — the frontend guard is UX, not security. Admin
  endpoints reject non-admin sessions; the bearer token is attached in `src/services/api.ts`.
- Without `VITE_API_BASE_URL` + `VITE_GITHUB_CLIENT_ID` the portal runs in **demo mode** with a
  local session so the whole flow stays exercisable offline. No secrets are ever shipped to the
  client.

## Scoring — official Geekstober values

Defined **once** in [`src/config/scoring.ts`](src/config/scoring.ts):

| Difficulty | XP   |
| ---------- | ---- |
| Easy       | 10   |
| Medium     | 30   |
| Difficult  | 50   |

Issues, project pages, contribution details, dashboard, leaderboard, badges and the admin portal
all read this module (`xpForDifficulty`, `XP_BREAKDOWN`, `formatXpRange`) — no component hardcodes
a score.

## Architecture

```
src/
├── components/   ui, layout, navigation, hero, home, projects, leaderboard,
│                 contributions, badges, progress, github, charts, search, rules
├── pages/        route components (Admin/ console, Login/ portal)
├── routes/       AppRoutes + RequireAuth guard
├── services/     api.ts (HTTP gateway + bearer token) + one module per domain
├── hooks/        TanStack Query hooks and UI helpers
├── contexts/     AuthContext (GitHub OAuth session)
├── data/mock/    projects, users, contributions, badges, scoring, github
├── types/        the API contract (interfaces only — no `any`)
├── config/       site-wide configuration (nav, stats, levels) + scoring (XP)
└── utils/        formatting, class names, activity grid generation
```

### Backend integration

Every request goes through `src/services/api.ts`; UI components never call `fetch` directly.
Each service exposes both branches:

```ts
export async function getProjects(filters: ProjectFilters) {
  if (isBackendConfigured()) return api.get<Paginated<Project>>('/projects', { ...filters })
  // mock branch — same contract, local data + filtering
}
```

Set `VITE_API_BASE_URL=http://localhost:5000/api` in `.env` and the same components start calling
the Express API with no other changes.

Remaining integration points are marked in the source:

```ts
// TODO: Connect GitHub webhook data
// TODO: Connect admin CRUD API
// TODO: Connect badge API
```

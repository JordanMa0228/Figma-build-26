# FlowSense Frontend

FlowSense is a frontend-only analytics prototype for exploring `Subjective Time Rate (STR)` and flow-state session data. The app now uses a `TypeScript + feature-based` structure and a denser hybrid visual language: dashboard-first, data-heavy, and lightly futuristic.

## Stack

- `React 18`
- `Vite`
- `TypeScript`
- `Tailwind CSS`
- `React Router`
- `TanStack Query`
- `Zustand`
- `Recharts`
- `React Hook Form`
- `Zod`
- `Axios`
- `i18next` / `react-i18next` (en, zh, es)

## Local Setup

```bash
npm install
npm run dev
```

Optional commands:

```bash
npm run typecheck
npm run build
npm run preview
```

## Current Scope

- Frontend only
- Mock data only
- No backend integration yet
- UI refactored toward a stronger analytics dashboard feel

## Route Map

- `/` overview dashboard (language selector in header)
- `/login` sign in (language selector; data tracking for backend)
- `/register` sign up (language selector; data tracking for backend)
- `/sessions` searchable session warehouse
- `/sessions/:id` single-session analysis report
- `/trends` cross-session analytics
- `/compare` side-by-side session comparison
- `/settings` signal and privacy configuration

## Updated Structure

```text
src/
  app/
    App.tsx
    providers.tsx
    router.tsx
  components/
    cards/
    charts/
    layout/
    ui/
  data/
    mock-data.ts
  features/
    analytics/
    compare/
    dashboard/
    sessions/
    settings/
    trends/
  lib/
    api-client.ts
    query-client.ts
    utils.ts
  store/
    ui-store.ts
  types/
    domain.ts
  main.tsx
  index.css
```

## Deployment (Netlify)

This is a Vite + React Router SPA. Netlify serves static files by default, which means refreshing or directly accessing a deep link (e.g. `/sessions/<id>`, `/compare`) returns a **404** because Netlify looks for a matching file on disk.

The fix is `public/_redirects`:

```
/*    /index.html   200
```

This file is already included in the repo. Vite copies everything in `public/` to the build output (`dist/`), so Netlify will pick it up automatically on every deploy. The rule rewrites all paths to `index.html` with HTTP 200, letting React Router handle client-side navigation.

**Affected routes now correctly served after refresh:**
- `/sessions`
- `/sessions/:id`
- `/compare`

> **API calls are not affected.** The frontend targets the backend via `VITE_API_BASE_URL` (an external domain), so there are no relative `/api/*` paths that could be incorrectly rewritten.

## Notes

- **i18n**: `react-i18next` with locales in `src/locales/` (en, zh, es). Use **i18n Ally** in VS Code/Cursor for editing. Language is stored in `localStorage` and can be chosen on the home header or on login/register pages.
- **Auth**: Mock login/register at `/login` and `/register`; token and user are stored in Zustand + `localStorage`. Ready for backend auth API swap.
- **Tracking**: `src/lib/tracking.ts` exposes `track(event, payload)` for analytics. Events: `page_view`, `language_change`, `login`, `register`, `logout`, `login_fail`, `register_fail`. Replace `sendToBackend()` inside with your analytics API.
- `TanStack Query` is used even with mock data so the frontend is already shaped like an API consumer.
- `Zustand` stores cross-page UI state such as session filters, compare selections, and auth user.
- `React Hook Form + Zod` are wired into `Settings` and auth forms so the form layer is ready for future persistence.

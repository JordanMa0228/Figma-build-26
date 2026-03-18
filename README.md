# FlowSense

**🌐 Live App: [https://flow-sense.netlify.app/](https://flow-sense.netlify.app/)**

> Built for **FigBuild 2026** — Figma's Annual Student Design-a-thon

## What is FlowSense?

FlowSense is a full-stack cognitive analytics platform designed to help users understand and improve their **concentration and focus levels** during work sessions. At its core, FlowSense tracks **Subjective Time Rate (STR)** — a signal that reflects how compressed or stretched time feels during deep focus — to quantify how deeply a user is concentrating at any given moment.

Our goal is to give students, researchers, and knowledge workers a clear, data-driven window into their own cognitive states, so they can identify peak focus patterns, reduce distractions, and build better working habits over time.

## Key Features

- 📊 **Concentration Dashboard** — real-time KPIs showing flow ratio, average STR, and longest focus streak
- 🗂️ **Session Warehouse** — searchable, filterable log of all recorded focus sessions
- 🔍 **Session Detail** — per-session flow timeline, STR curve, and sensor quality breakdown
- 📈 **Trends & Analytics** — cross-session patterns by task type, time of day, and weekly flow minutes
- ⚖️ **Session Comparison** — side-by-side comparison of two sessions with delta metrics
- 🌐 **Multi-language Support** — English, Chinese (中文), and Spanish (Español)

## Stack

### Frontend
- `React 18` + `TypeScript` + `Vite`
- `Tailwind CSS`
- `React Router`
- `TanStack Query`
- `Zustand`
- `Recharts`
- `React Hook Form` + `Zod`
- `i18next` / `react-i18next`

### Backend
- `Express` + `TypeScript`
- `Prisma` + `PostgreSQL`
- `JWT` authentication

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

## Route Map

- `/` — Overview dashboard
- `/login` — Sign in
- `/register` — Sign up
- `/sessions` — Searchable session warehouse
- `/sessions/:id` — Single-session analysis report
- `/trends` — Cross-session analytics
- `/compare` — Side-by-side session comparison
- `/settings` — Signal and privacy configuration
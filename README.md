# Harry Potter Explorer

A Next.js app that explores the wizarding world — characters, houses, and
spells — fed by the public [Harry Potter API](https://hp-api.onrender.com).

## Features

- **Characters** — full list with client-side search (`?search=…`),
  house (`?house=…`) and type (`?type=students|staff`) filters, pagination
  (`?page=…`), and a detail view per character. All URL state is
  shareable and survives refresh / back / forward (nuqs).
- **Spells** — the 77-record spell list with debounced client-side search.
- **Build-time static data** — the immutable datasets are prefetched at
  build time (SSG) and hydrated into TanStack Query, so the browser never
  pays the API's cold start on first visit.
- **Restrained "magical editorial" design** — warm parchment, deep ink,
  brass accents; light/dark theme, respects `prefers-reduced-motion`.

## Tech Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- TanStack Query (server state) · nuqs (URL state) · Zod (API validation)
- shadcn/ui v4 (Base UI) · motion (animations) · Vitest + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The hosted API sleeps when idle — the first request (including at build
> time) can take tens of seconds or fail. A `next build` can therefore be
> slow or fail if the API just woke up; retrying works.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (SSG) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the test suite once (Vitest) |
| `npm run test:watch` | Test suite in watch mode |
| `npm run format` | Prettier |

Type checking: there is no `typecheck` script — use `npx tsc --noEmit`.

## Environment

The API base URL is overridable at build time:

```
NEXT_PUBLIC_API_URL=https://hp-api.onrender.com
```

See `.env.example`.

## Documentation

- [PRD.md](PRD.md) — product requirements
- [ARCHITECTURE.md](ARCHITECTURE.md) — layers, data flow, project structure
- [DECISIONS.md](DECISIONS.md) — key decisions (SSG hydration, stale policy)
- [docs/API_CONTRACT.md](docs/API_CONTRACT.md) — verified API facts and
  how the app works around them (no search, no pagination, no detail endpoints)
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md) — data model and normalization

## Testing

Vitest + Testing Library (jsdom). Tests cover the API boundary, search /
filter / pagination behavior, URL state, and loading / error / empty states:

```bash
npm test
```

## Deploy

Plain `next build` SSG output — deployable anywhere static Next.js runs,
including Cloudflare Pages. No server-side-only APIs are introduced.

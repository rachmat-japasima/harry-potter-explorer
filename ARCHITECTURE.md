# Architecture

## Overview

## Design System

Restrained "magical editorial" direction — warm parchment ground, deep ink
text, brass/gold used at small scale. The direction contract lives as a
comment at the top of `src/app/layout.tsx`.

- **Tokens** — `src/app/globals.css` (`:root` light + `.dark` active,
  `color-scheme` per theme): oklch palette, `--radius: 0.5rem`,
  `--shadow-card`, semantic success/warning/error. House colors are
  deliberately NOT global tokens; they belong to character UI.
- **Theme** — `src/providers/theme-provider.tsx` (client): `dark` class on
  `<html>`, persisted to `localStorage`; defaults to **dark** — only an
  explicit light choice opts out. A no-FOUC inline script in the root
  layout sets the class before first paint. Toggle lives in the footer
  (`src/components/layout/theme-toggle.tsx`).
- **Fonts** — Fraunces (display serif, `--font-display` → `font-heading`),
  Geist (body), Geist Mono. Loaded via `next/font` in the root layout.
- **Layout components** — `src/components/layout/`: `Container` (shared
  max-w-6xl shell), `Navbar` (sticky, top nav, active states), `MobileNav`
  (keyboard-accessible disclosure: Escape, focus return, animated via
  Motion, disabled under `prefers-reduced-motion`), `Footer`.
- **Shared components** — `src/components/shared/`: `PageHeader`,
  `EmptyState`, `ErrorState`, `LoadingState`. All server components; actions
  are passed as `ReactNode` so callers supply interactive controls.
- **Motion** — `motion/react`; `MotionConfig reducedMotion="user"` wraps the
  app in `src/providers/query-provider.tsx`. Used sparingly (mobile menu,
  hero-adjacent transitions).
- **UI primitives** — shadcn/ui v4 (Base UI): `button`, `skeleton`
  installed; more added per-feature as needed.

## Application Layers

App Router (server pages under src/app, e.g. src/app/characters)
    ↓
Feature Components (client orchestrators, e.g. src/components/characters)
    ↓
Feature layer (src/features/<domain>/{api,queries,types,schema,utils}.ts)
    ↓
TanStack Query
    ↓
API Client
    ↓
Harry Potter API

## Server vs Client Components

## State Management

### Server State
TanStack Query

### URL State
nuqs

### Local State
useState

### Shared Client State
Zustand (only when required)

## Data Flow

Build time (SSG): QueryClient → `fetchQuery` → `dehydrate` →
`HydrationBoundary` — the static page carries the full character list.
Runtime: TanStack Query holds the hydrated cache; search / house / type /
pagination apply client-side; lazy queries (students, staff, house) fetch
only when selected. Rationale in `DECISIONS.md`.

## Error Handling

## Project Structure

```
src/
├── app/                    # routes; server components by default
│   └── characters/[id]/
├── components/             # UI per feature (characters/, layout/, shared/)
├── features/               # per-domain logic
│   ├── characters/         # api, queries, types, schema, utils
│   └── houses/             # utils only (no houses endpoint exists)
├── lib/                    # api-client, utils
├── providers/              # theme, TanStack Query
└── test/                   # fixtures, render helper, setup
```

## Performance Considerations
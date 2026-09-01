# Decisions

## Build-time static data, hydrated into TanStack Query (2026-09-02)

**Problem**: the external HP API sleeps when idle — the first request can
take tens of seconds or fail, and every first visit previously paid it
client-side behind a skeleton.

**Decision**: prefetch the immutable datasets at build time and hydrate
them into the client-side TanStack Query cache (`fetchQuery` →
`dehydrate` → `HydrationBoundary` in `src/app/characters/page.tsx`).
The static page carries the data; the browser never fetches on load.
TanStack Query stays the server-state layer for everything after.

**Why TanStack Query, not plain fetch**: the client already depends on its
cache — filters, search, pagination, and detail lookup
(`['characters']`) all key off it. Hydration just seeds the existing
mechanism; nothing new is introduced.

**What is prefetched**: only the default full character list
(`['characters']`). Students/staff (`['characters','students'|'staff']`)
and house lists (`['characters','house',house]`) load lazily when
selected — the minimum useful initial dataset.

**Stale policy**: `staleTime: Infinity` on the client QueryClient
(`src/providers/query-provider.tsx`). The dataset is immutable, and
hydrated data's `dataUpdatedAt` is the build timestamp — any finite
staleTime makes it instantly stale and refetches on mount (the duplicate
request hydration exists to avoid). Manual `refetch()` (Try again) and
error retries still work.

**Build failures**: `prefetchCharacters` uses `fetchQuery` (throws) rather
than the deprecated `prefetchQuery`, which swallows errors — if the API is
down after 3 retries, the build fails loudly instead of baking in an empty
page.

**Detail pages**: remain dynamic (`ƒ`). Static detail pages would need the
~182 KB list hydrated per page (N+1 build fetches) or embedded per page;
the server-rendered shell + client cache lookup stays.

**Spells**: no `/spells` page exists yet (deferred feature). The same
pattern applies when it lands.

**Deployment**: plain `next build` SSG — Cloudflare Pages compatible; no
Vercel-only APIs introduced.

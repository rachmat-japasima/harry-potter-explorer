import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { SpellGridSkeleton } from "@/components/spells/spell-grid-skeleton";
import { SpellsExplorer } from "@/components/spells/spells-explorer";
import { prefetchSpells } from "@/features/spells/queries";

export const metadata = {
  title: "Spells",
};

/**
 * Server shell: prefetches the spell list at build time (SSG) and hydrates
 * it into the client TanStack Query cache, so the first paint never waits
 * on a browser-side request — the external API has a slow cold start. Runs
 * inside Suspense: Next 16 prerenders uncached data access only within a
 * Suspense boundary.
 */
async function SpellsData() {
  const queryClient = new QueryClient();
  await prefetchSpells(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpellsExplorer />
    </HydrationBoundary>
  );
}

export default function SpellsPage() {
  return (
    <Container className="py-10 sm:py-16">
      <PageHeader
        title="Spells"
        description="A collection of magical spells from the wizarding world."
      />
      <div className="mt-10">
        {/* nuqs useQueryState calls useSearchParams — needs a Suspense
            boundary to prerender statically. Skeleton doubles as SSR fallback. */}
        <Suspense fallback={<SpellGridSkeleton />}>
          <SpellsData />
        </Suspense>
      </div>
    </Container>
  );
}

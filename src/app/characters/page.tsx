import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

import { CharacterGridSkeleton } from "@/components/characters/character-grid-skeleton";
import { CharactersExplorer } from "@/components/characters/characters-explorer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";
import { prefetchCharacters } from "@/features/characters/queries";

export const metadata = {
  title: "Characters",
};

/**
 * Server shell: prefetches the character list at build time (SSG) and
 * hydrates it into the client TanStack Query cache, so the first paint
 * never waits on a browser-side request — the external API has a slow
 * cold start. Runs inside Suspense: Next 16 prerenders uncached data
 * access only within a Suspense boundary.
 */
async function CharactersData() {
  const queryClient = new QueryClient();
  await prefetchCharacters(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CharactersExplorer />
    </HydrationBoundary>
  );
}

export default function CharactersPage() {
  return (
    <Container className="py-10 sm:py-16">
      <PageHeader
        title="Characters"
        description="Explore the witches and wizards of the Wizarding World."
      />
      <div className="mt-10">
        {/* nuqs useQueryState calls useSearchParams — needs a Suspense
            boundary to prerender statically. Skeleton doubles as SSR fallback. */}
        <Suspense fallback={<CharacterGridSkeleton />}>
          <CharactersData />
        </Suspense>
      </div>
    </Container>
  );
}

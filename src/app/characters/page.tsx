import { Suspense } from "react";

import { CharacterGridSkeleton } from "@/components/characters/character-grid-skeleton";
import { CharactersExplorer } from "@/components/characters/characters-explorer";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = {
  title: "Characters",
};

/**
 * Server shell: the interactive explorer (search, house filter,
 * pagination, query states) is a client component below.
 */
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
          <CharactersExplorer />
        </Suspense>
      </div>
    </Container>
  );
}

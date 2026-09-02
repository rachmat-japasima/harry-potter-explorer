"use client";

import { useQueryState } from "nuqs";

import { SpellGrid } from "@/components/spells/spell-grid";
import { SpellGridSkeleton } from "@/components/spells/spell-grid-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { useSpells } from "@/features/spells/queries";
import { searchSpells } from "@/features/spells/utils";

/**
 * The interactive half of the spells page. Data comes from TanStack Query
 * (full list, hydrated at build time); search applies client-side per the
 * API contract. Search state lives in the URL via nuqs: ?search=….
 */
export function SpellsExplorer() {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
  });

  const spellsQuery = useSpells();
  const filtered = searchSpells(spellsQuery.data ?? [], search);

  if (spellsQuery.isPending) {
    return <SpellGridSkeleton />;
  }

  if (spellsQuery.isError) {
    return (
      <ErrorState
        title="Something went wrong"
        description="We couldn't load the spells."
        action={<Button onClick={() => spellsQuery.refetch()}>Try again</Button>}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SearchInput label="Search spells" placeholder="Search spells…" />

      {filtered.length === 0 ? (
        <EmptyState
          title="No spells found"
          description="Try another search."
          action={<Button onClick={() => setSearch(null)}>Clear search</Button>}
        />
      ) : (
        <SpellGrid spells={filtered} />
      )}
    </div>
  );
}

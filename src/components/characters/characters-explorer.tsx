"use client";

import { parseAsInteger, useQueryState } from "nuqs";

import { CharacterGrid } from "@/components/characters/character-grid";
import { CharacterGridSkeleton } from "@/components/characters/character-grid-skeleton";
import { HouseFilter } from "@/components/characters/house-filter";
import { Pagination } from "@/components/characters/pagination";
import { SearchInput } from "@/components/characters/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import {
  useCharacters,
  useHouseCharacters,
} from "@/features/characters/queries";
import { searchCharacters } from "@/features/characters/utils";
import { getHouseList } from "@/features/houses/utils";
import { paginate } from "@/lib/utils";

export const CHARACTERS_PAGE_SIZE = 12;

/**
 * The interactive half of the characters page. Data comes from TanStack
 * Query (full list, or the house endpoint when a house is selected);
 * search + pagination apply client-side per the API contract. All filter
 * state lives in the URL via nuqs: ?search=…&house=…&page=N.
 */
export function CharactersExplorer() {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
  });
  const [house, setHouse] = useQueryState("house", {
    defaultValue: "",
    clearOnDefault: true,
  });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const allCharactersQuery = useCharacters();
  const houseCharactersQuery = useHouseCharacters(house);
  const query = house ? houseCharactersQuery : allCharactersQuery;

  const characters = query.data ?? [];
  const houses = getHouseList(allCharactersQuery.data ?? []);
  const filtered = searchCharacters(characters, search);
  const pageItems = paginate(filtered, page, CHARACTERS_PAGE_SIZE);

  const clearFilters = () => {
    setSearch(null);
    setHouse(null);
    setPage(1);
  };

  if (query.isPending) {
    return <CharacterGridSkeleton />;
  }

  if (query.isError) {
    return (
      <ErrorState
        title="Something went wrong"
        description="We couldn't load the characters."
        action={<Button onClick={() => query.refetch()}>Try again</Button>}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SearchInput />

      <section aria-labelledby="houses-heading" className="space-y-3">
        <h2
          id="houses-heading"
          className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
        >
          Houses
        </h2>
        <HouseFilter houses={houses} />
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          title="No characters found"
          description="Try another search or remove your filters."
          action={<Button onClick={clearFilters}>Clear filters</Button>}
        />
      ) : (
        <>
          <CharacterGrid characters={pageItems} />
          <Pagination
            totalItems={filtered.length}
            pageSize={CHARACTERS_PAGE_SIZE}
          />
        </>
      )}
    </div>
  );
}

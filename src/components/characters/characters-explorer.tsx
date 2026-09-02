"use client";

import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";

import { CharacterGrid } from "@/components/characters/character-grid";
import { CharacterGridSkeleton } from "@/components/characters/character-grid-skeleton";
import { HouseFilter } from "@/components/characters/house-filter";
import { Pagination } from "@/components/characters/pagination";
import { TypeFilter } from "@/components/characters/type-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import {
  useCharacters,
  useHouseCharacters,
  useTypeCharacters,
} from "@/features/characters/queries";
import { searchCharacters } from "@/features/characters/utils";
import { getHouseList, houseToSlug } from "@/features/houses/utils";
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
  const [type, setType] = useQueryState(
    "type",
    parseAsStringLiteral(["all", "students", "staff"] as const).withDefault(
      "all",
    ),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const allCharactersQuery = useCharacters();
  const houseCharactersQuery = useHouseCharacters(house, type === "all");
  const typeCharactersQuery = useTypeCharacters(type);

  // Type endpoints ignore query params (verified), so a house selection
  // combines client-side over the type list; for type=all the house
  // endpoint keeps doing the server-side filtering.
  const query =
    type === "all"
      ? house
        ? houseCharactersQuery
        : allCharactersQuery
      : typeCharactersQuery;

  const characters =
    type !== "all" && house
      ? (typeCharactersQuery.data ?? []).filter(
          (c) => c.house !== null && houseToSlug(c.house) === house,
        )
      : (query.data ?? []);
  const houses = getHouseList(allCharactersQuery.data ?? []);
  const filtered = searchCharacters(characters, search);
  const pageItems = paginate(filtered, page, CHARACTERS_PAGE_SIZE);

  const clearFilters = () => {
    setSearch(null);
    setHouse(null);
    setType(null);
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

  const emptyTitle =
    type === "students"
      ? "No students found"
      : type === "staff"
        ? "No staff found"
        : "No characters found";

  return (
    <div className="space-y-8">
      <SearchInput
        label="Search characters"
        placeholder="Search characters by name…"
      />

      <div className="flex flex-wrap gap-6">
        <section aria-labelledby="type-heading" className="space-y-3">
          <h2
            id="type-heading"
            className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            Character Type
          </h2>
          <TypeFilter />
        </section>

        <section aria-labelledby="houses-heading" className="space-y-3">
          <h2
            id="houses-heading"
            className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            Houses
          </h2>
          <HouseFilter houses={houses} />
        </section>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={emptyTitle}
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

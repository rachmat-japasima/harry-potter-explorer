import { useQuery } from "@tanstack/react-query";

import { getCharacters, getHouseCharacters } from "@/features/characters/api";

/** Full character list — the shared cache detail pages read from. */
export function useCharacters() {
  return useQuery({
    queryKey: ["characters"],
    queryFn: getCharacters,
  });
}

/** House-filtered list via GET /api/characters/house/:house. */
export function useHouseCharacters(house: string) {
  return useQuery({
    queryKey: ["characters", "house", house],
    queryFn: () => getHouseCharacters(house),
    enabled: house !== "",
  });
}

/**
 * Character detail. The API has no detail endpoint (404s, verified), so the
 * detail view reads from the already-fetched full list cache, lookup by id.
 * `isNotFound` distinguishes "loaded list without this id" from an API error.
 */
export function useCharacter(id: string) {
  const charactersQuery = useCharacters();
  const character =
    charactersQuery.data?.find((c) => c.id === id) ?? null;

  return {
    ...charactersQuery,
    character,
    isNotFound: charactersQuery.isSuccess && character === null,
  };
}

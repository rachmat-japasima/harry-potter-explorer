import { useQuery, type QueryClient } from "@tanstack/react-query";

import {
  getCharacters,
  getHouseCharacters,
  getStaff,
  getStudents,
} from "@/features/characters/api";
import type { CharacterType } from "@/features/characters/types";

/** Full character list — the shared cache detail pages read from. */
export function useCharacters() {
  return useQuery({
    queryKey: ["characters"],
    queryFn: getCharacters,
  });
}

/**
 * Build-time (SSG) prefetch of the full list, used by the characters page.
 * Uses fetchQuery (throws on failure) rather than prefetchQuery, which is
 * deprecated and swallows errors — a dead API must fail the build loudly,
 * not bake in an empty page.
 */
export function prefetchCharacters(queryClient: QueryClient) {
  return queryClient.fetchQuery({
    queryKey: ["characters"],
    queryFn: getCharacters,
    retry: 3,
  });
}

/**
 * House-filtered list via GET /api/characters/house/:house. `enabled` is
 * false when a type filter is active — type lists combine with house
 * client-side, so the house endpoint is not needed then.
 */
export function useHouseCharacters(house: string, enabled = true) {
  return useQuery({
    queryKey: ["characters", "house", house],
    queryFn: () => getHouseCharacters(house),
    enabled: enabled && house !== "",
  });
}

/**
 * Students/Staff list via the dedicated type endpoints. Query keys
 * `['characters', 'students']` / `['characters', 'staff']` distinguish them
 * from the full list `['characters']`. Fetched only when that type is
 * selected; the API ignores query params, so house+search filters apply
 * client-side over whichever list is loaded.
 */
export function useTypeCharacters(type: CharacterType) {
  const queryFn =
    type === "students" ? getStudents : type === "staff" ? getStaff : null;

  return useQuery({
    queryKey: ["characters", type],
    queryFn: () => (queryFn ? queryFn() : Promise.resolve([])),
    enabled: queryFn !== null,
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

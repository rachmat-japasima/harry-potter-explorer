import { useQuery, type QueryClient } from "@tanstack/react-query";

import { getSpells } from "@/features/spells/api";

/** Full spell list — 77 records, no query params exist. */
export function useSpells() {
  return useQuery({
    queryKey: ["spells"],
    queryFn: getSpells,
  });
}

/**
 * Build-time (SSG) prefetch of the full list, used by the spells page.
 * Uses fetchQuery (throws on failure) rather than prefetchQuery, which is
 * deprecated and swallows errors — a dead API must fail the build loudly,
 * not bake in an empty page.
 */
export function prefetchSpells(queryClient: QueryClient) {
  return queryClient.fetchQuery({
    queryKey: ["spells"],
    queryFn: getSpells,
    retry: 3,
  });
}

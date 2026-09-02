import type { Spell } from "@/features/spells/types";

/**
 * Client-side search — the API accepts no search parameter.
 * Case-insensitive substring match on name and description.
 */
export function searchSpells(spells: Spell[], query: string): Spell[] {
  const q = query.trim().toLowerCase();
  if (!q) return spells;
  return spells.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q),
  );
}

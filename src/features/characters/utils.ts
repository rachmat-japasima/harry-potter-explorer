import type { ApiCharacter } from "@/features/characters/schema";
import type { Character, Wand } from "@/features/characters/types";

/**
 * The single boundary transform between API and domain records:
 * 1. `""` → `null` for every string field.
 * 2. Wand shells with no data → `wand: null`.
 */
export function normalizeCharacter(api: ApiCharacter): Character {
  const emptyToNull = (value: string | null) => (value === "" ? null : value);

  return {
    id: api.id,
    name: api.name,
    alternate_names: api.alternate_names,
    species: emptyToNull(api.species),
    gender: emptyToNull(api.gender),
    house: emptyToNull(api.house),
    dateOfBirth: emptyToNull(api.dateOfBirth),
    yearOfBirth: api.yearOfBirth,
    wizard: api.wizard,
    ancestry: emptyToNull(api.ancestry),
    eyeColour: emptyToNull(api.eyeColour),
    hairColour: emptyToNull(api.hairColour),
    wand: normalizeWand(api.wand),
    patronus: emptyToNull(api.patronus),
    hogwartsStudent: api.hogwartsStudent,
    hogwartsStaff: api.hogwartsStaff,
    actor: emptyToNull(api.actor),
    alternate_actors: api.alternate_actors,
    alive: api.alive,
    image: emptyToNull(api.image),
  };
}

function normalizeWand(wand: ApiCharacter["wand"]): Wand | null {
  const wood = wand.wood === "" ? null : wand.wood;
  const core = wand.core === "" ? null : wand.core;
  if (!wood && !core && wand.length === null) return null;
  return { wood, core, length: wand.length };
}

/**
 * Client-side name search — the API accepts no search parameter.
 * Case-insensitive substring match on `name` and `alternate_names`.
 */
export function searchCharacters(
  characters: Character[],
  query: string,
): Character[] {
  const q = query.trim().toLowerCase();
  if (!q) return characters;
  return characters.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.alternate_names.some((name) => name.toLowerCase().includes(q)),
  );
}

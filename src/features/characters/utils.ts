import type { ApiCharacter } from "./schema";
import type { Character, Wand } from "./types";

/**
 * The API encodes "unknown" as `""` for most string fields. Normalize to
 * null once at the boundary so the UI deals with a single "no value" shape.
 */
function toNull(value: string | null): string | null {
  return value ? value : null;
}

/** Collapse an empty wand shell (412/437 records) to null. */
function normalizeWand(wand: ApiCharacter["wand"]): Wand | null {
  const wood = toNull(wand.wood);
  const core = toNull(wand.core);
  const length = wand.length;
  if (wood === null && core === null && length === null) {
    return null;
  }
  return { wood, core, length };
}

export function normalizeCharacter(character: ApiCharacter): Character {
  return {
    id: character.id,
    name: character.name,
    alternate_names: character.alternate_names,
    species: toNull(character.species),
    gender: toNull(character.gender),
    house: toNull(character.house),
    dateOfBirth: toNull(character.dateOfBirth),
    yearOfBirth: character.yearOfBirth,
    wizard: character.wizard,
    ancestry: toNull(character.ancestry),
    eyeColour: toNull(character.eyeColour),
    hairColour: toNull(character.hairColour),
    wand: normalizeWand(character.wand),
    patronus: toNull(character.patronus),
    hogwartsStudent: character.hogwartsStudent,
    hogwartsStaff: character.hogwartsStaff,
    actor: toNull(character.actor),
    alternate_actors: character.alternate_actors,
    alive: character.alive,
    image: toNull(character.image),
  };
}

/**
 * Client-side name search — the API has no search parameter.
 * Case-insensitive substring match on `name` and `alternate_names`;
 * an empty/whitespace query returns the input unchanged.
 */
export function searchCharacters(
  characters: Character[],
  query: string
): Character[] {
  const q = query.trim().toLowerCase();
  if (!q) return characters;
  return characters.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.alternate_names.some((name) => name.toLowerCase().includes(q))
  );
}

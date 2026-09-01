import { getJSON } from "@/lib/api-client";

import { apiCharacterSchema } from "@/features/characters/schema";
import type { Character } from "@/features/characters/types";
import { normalizeCharacter } from "@/features/characters/utils";

function parseCharacters(raw: unknown): Character[] {
  return apiCharacterSchema.array().parse(raw).map(normalizeCharacter);
}

/** Fetch the full character list (437 records; no query params exist). */
export async function getCharacters(): Promise<Character[]> {
  return parseCharacters(await getJSON("/api/characters"));
}

/** Fetch one house's records via the dedicated endpoint. */
export async function getHouseCharacters(house: string): Promise<Character[]> {
  return parseCharacters(
    await getJSON(`/api/characters/house/${encodeURIComponent(house)}`),
  );
}

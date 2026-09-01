import { getJSON } from "@/lib/api-client";
import { characterSchema } from "./schema";
import { normalizeCharacter } from "./utils";
import type { Character } from "./types";

/**
 * Fetch the full character collection.
 *
 * The API exposes no character detail endpoint — `GET /api/characters/:id`
 * returns 404 even for ids from the list (verified 2026-09-01) — and no
 * pagination or query parameters. The full list is the unit of data:
 * detail views, search, and filtering all work client-side over this list.
 */
export async function getCharacters(): Promise<Character[]> {
  const data = characterSchema.array().parse(await getJSON("/api/characters"));
  return data.map(normalizeCharacter);
}

/**
 * Students are characters with `hogwartsStudent: true` — the endpoint
 * filters server-side (verified: 103 records, all students).
 */
export async function getStudents(): Promise<Character[]> {
  const data = characterSchema
    .array()
    .parse(await getJSON("/api/characters/students"));
  return data.map(normalizeCharacter);
}

/**
 * Staff are characters with `hogwartsStaff: true` — the endpoint filters
 * server-side (verified: 25 records, all staff).
 */
export async function getStaff(): Promise<Character[]> {
  const data = characterSchema
    .array()
    .parse(await getJSON("/api/characters/staff"));
  return data.map(normalizeCharacter);
}

/**
 * Characters of one house — filtered server-side (verified: only that
 * house's records are returned). The endpoint is case-insensitive and
 * returns an empty array for an unknown house.
 */
export async function getCharactersByHouse(house: string): Promise<Character[]> {
  const data = characterSchema
    .array()
    .parse(await getJSON(`/api/characters/house/${encodeURIComponent(house)}`));
  return data.map(normalizeCharacter);
}

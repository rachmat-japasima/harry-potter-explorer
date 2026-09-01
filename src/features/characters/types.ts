/**
 * Domain types for characters. Normalized: "unknown" is always `null`,
 * never `""` (see DATA_MODEL.md). Field names intentionally mirror the API.
 */

export interface Wand {
  wood: string | null;
  core: string | null;
  length: number | null;
}

export interface Character {
  id: string;
  name: string;
  alternate_names: string[];
  species: string | null;
  gender: string | null;
  house: string | null;
  dateOfBirth: string | null; // "dd-mm-yyyy", e.g. "31-07-1980"
  yearOfBirth: number | null;
  wizard: boolean;
  ancestry: string | null;
  eyeColour: string | null;
  hairColour: string | null;
  wand: Wand | null;
  patronus: string | null;
  hogwartsStudent: boolean;
  hogwartsStaff: boolean;
  actor: string | null;
  alternate_actors: string[];
  alive: boolean;
  image: string | null; // https URL or null
}

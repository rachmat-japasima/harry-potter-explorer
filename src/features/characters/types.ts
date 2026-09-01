/**
 * Domain types for the Characters feature.
 *
 * Field names intentionally mirror the API (including snake_case
 * alternate_names / alternate_actors) so the normalized model stays
 * recognizably the API model — normalization only turns empty strings
 * into nulls (see utils.ts).
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
  /** "dd-mm-yyyy" when known (e.g. "31-07-1980"), otherwise null. */
  dateOfBirth: string | null;
  yearOfBirth: number | null;
  wizard: boolean;
  ancestry: string | null;
  eyeColour: string | null;
  hairColour: string | null;
  /** null when the API returned an empty wand (412/437 records). */
  wand: Wand | null;
  patronus: string | null;
  hogwartsStudent: boolean;
  hogwartsStaff: boolean;
  actor: string | null;
  alternate_actors: string[];
  alive: boolean;
  /** null when the API has no image (412/437 records). */
  image: string | null;
}

import { z } from "zod";

/**
 * Zod schemas mirroring the actual `/api/characters` response (verified
 * 2026-09-01 against https://hp-api.onrender.com).
 *
 * Verified data facts these schemas encode:
 * - Every string field is always present; unknown values are `""` (never null),
 *   except dateOfBirth which is `null` (417/437) or `""` (1/437).
 * - yearOfBirth is `number | null` (414/437 null).
 * - wand is always an object with wood/core as strings (`""` when unknown)
 *   and length as `number | null`.
 */

export const wandSchema = z.object({
  wood: z.string(),
  core: z.string(),
  length: z.number().nullable(),
});

export const characterSchema = z.object({
  id: z.string(),
  name: z.string(),
  alternate_names: z.array(z.string()),
  species: z.string(),
  gender: z.string(),
  house: z.string(),
  dateOfBirth: z.string().nullable(),
  yearOfBirth: z.number().nullable(),
  wizard: z.boolean(),
  ancestry: z.string(),
  eyeColour: z.string(),
  hairColour: z.string(),
  wand: wandSchema,
  patronus: z.string(),
  hogwartsStudent: z.boolean(),
  hogwartsStaff: z.boolean(),
  actor: z.string(),
  alternate_actors: z.array(z.string()),
  alive: z.boolean(),
  image: z.string(),
});

/** Raw API shape — never used directly by the UI; normalize via utils. */
export type ApiCharacter = z.infer<typeof characterSchema>;

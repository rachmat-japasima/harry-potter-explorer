import { z } from "zod";

/**
 * Raw API character record. Unknown values arrive as `""` (strings) or
 * `null` (dateOfBirth, yearOfBirth, wand.length). Normalization happens in
 * utils.ts; the schema only validates shape.
 */
export const apiWandSchema = z.object({
  wood: z.string(),
  core: z.string(),
  length: z.number().nullable(),
});

export const apiCharacterSchema = z.object({
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
  wand: apiWandSchema,
  patronus: z.string(),
  hogwartsStudent: z.boolean(),
  hogwartsStaff: z.boolean(),
  actor: z.string(),
  alternate_actors: z.array(z.string()),
  alive: z.boolean(),
  image: z.string(),
});

export type ApiCharacter = z.infer<typeof apiCharacterSchema>;

import { z } from "zod";

/**
 * Raw API spell record. The spells endpoint returns only these three
 * fields, all non-empty in practice (verified 2026-09-01: 77/77 records).
 */
export const apiSpellSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

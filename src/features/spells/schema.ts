import { z } from "zod";

/**
 * Zod schema mirroring the actual `/api/spells` response (verified
 * 2026-09-01 against https://hp-api.onrender.com).
 *
 * Verified data facts: all 77 spells have non-empty id, name, and
 * description; no nullable or empty-string fields were observed.
 */
export const spellSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type ApiSpell = z.infer<typeof spellSchema>;

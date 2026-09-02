import type { z } from "zod";

import type { apiSpellSchema } from "@/features/spells/schema";

/**
 * Domain type = the raw API type: spells need no normalization (verified —
 * all 77 records are fully populated). See DATA_MODEL.md.
 */
export type Spell = z.infer<typeof apiSpellSchema>;

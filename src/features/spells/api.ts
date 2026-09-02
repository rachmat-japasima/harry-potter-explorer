import { getJSON } from "@/lib/api-client";

import { apiSpellSchema } from "@/features/spells/schema";
import type { Spell } from "@/features/spells/types";

function parseSpells(raw: unknown): Spell[] {
  return apiSpellSchema.array().parse(raw);
}

/** Fetch the full spell list (77 records; no query params exist). */
export async function getSpells(): Promise<Spell[]> {
  return parseSpells(await getJSON("/api/spells"));
}

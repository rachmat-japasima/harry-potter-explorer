import { getJSON } from "@/lib/api-client";
import { spellSchema } from "./schema";
import type { Spell } from "./types";

/** Fetch the full spell collection (77 records, no pagination or filters). */
export async function getSpells(): Promise<Spell[]> {
  return spellSchema.array().parse(await getJSON("/api/spells"));
}

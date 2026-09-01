/**
 * Domain type for the Spells feature.
 *
 * The API response maps cleanly to the domain (verified: no nulls or empty
 * strings in 77 records), so no separate Api/domain split or normalization
 * is needed — Spell is the schema's inferred type.
 */
export type { ApiSpell as Spell } from "./schema";

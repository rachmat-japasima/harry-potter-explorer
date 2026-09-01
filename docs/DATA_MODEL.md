# Data Model

Domain types live in the features they belong to:

```
src/features/characters/{types,schema,utils,api}.ts
src/features/spells/{types,schema,api}.ts
```

No database is involved — these are TypeScript types describing the API
payloads the UI renders.

## Character

```ts
interface Character {
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
```

## Wand

```ts
interface Wand {
  wood: string | null;
  core: string | null;
  length: number | null;
}
```

## Spell

```ts
type Spell = {
  id: string;
  name: string;
  description: string;
};
```

## API vs Domain Model

| Aspect | API (`ApiCharacter`) | Domain (`Character`) |
|---|---|---|
| Unknown strings | `""` (empty string) | `null` |
| `dateOfBirth` | `string \| null`, one record has `""` | `string \| null` (empty collapsed) |
| `wand` | always an object, often an empty shell | `Wand \| null` (shell collapsed) |
| Other fields | verbatim | identical — field names intentionally mirror the API, including snake_case `alternate_names` / `alternate_actors` |

The difference is deliberately small: normalization only collapses "no
value" representations to a single `null`. There is no re-mapping of field
names or restructuring of data.

Spells have **no** API/domain split — the verified response (77/77 records
fully populated) maps cleanly to the domain, so `Spell` is the schema's
inferred type.

## Nullable / Optional Fields

All fields are always present in the API response; `null`/`""` marks
"unknown", never "missing". Per-field unknown rates (437 characters):

| Field | Unknown | Notes |
|---|---|---|
| `patronus` | 419 (96%) | |
| `dateOfBirth` | 418 (96%) | mostly `null`, one `""` |
| `yearOfBirth` | 414 (95%) | `null` |
| `image` | 412 (94%) | 25 populated imagekit.io URLs |
| `wand` | 412 (94%) | empty shell → `null` |
| `eyeColour` | 370 (85%) | |
| `ancestry` | 325 (74%) | |
| `hairColour` | 309 (71%) | |
| `house` | 302 (69%) | |
| `actor` | 244 (56%) | |
| `gender` | 4 (1%) | |
| `species` | 0 | "human", "ghost", "goblin", "owl", ... |
| `alternate_names` / `alternate_actors` | never | may be `[]` |

Booleans (`wizard`, `alive`, `hogwartsStudent`, `hogwartsStaff`) and `id`
are always present and never null.

## Data Normalization

`normalizeCharacter(apiCharacter)` (in `src/features/characters/utils.ts`)
is the single boundary transform:

1. `""` → `null` for every string field.
2. Wand shells with no data → `wand: null`.

The UI therefore sees one consistent "no value" shape (`null`) and never
touches empty strings. Spells bypass normalization entirely.

## Relationships

```
Character
├── Wand           (owned, embedded object — never shared)
└── House          (plain string, not an entity — no house table/type)

Spell              (standalone collection — no relations)
```

There are no foreign keys or links between characters and spells in the
data; the app does not model any.

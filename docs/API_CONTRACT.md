# API Contract

The application consumes the public [Harry Potter API](https://hp-api.onrender.com)
directly from the browser. All facts below were verified against the live API
on **2026-09-01** (437 characters, 77 spells).

## Base URL

```
https://hp-api.onrender.com
```

Overridable at build time via `NEXT_PUBLIC_API_URL` (see `.env.example`).

- **Authentication**: none. No API key required.
- **CORS**: `Access-Control-Allow-Origin: *` — callable directly from the browser.
- **Cold start**: the hosted instance sleeps when idle; the first request after
  a period of inactivity can fail or take tens of seconds.

## Characters

### Get Characters

```
GET /api/characters
```

#### Query Parameters

None. The API accepts no query parameters — `page`, `limit`, `offset`, and
`search` values are silently ignored (verified: `?page=1&limit=2` returns the
full list).

#### Response

`200 OK`, `application/json` — a JSON **array** of character objects (437
records). Representative record:

```json
{
  "id": "9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8",
  "name": "Harry Potter",
  "alternate_names": ["The Boy Who Lived", "The Chosen One"],
  "species": "human",
  "gender": "male",
  "house": "Gryffindor",
  "dateOfBirth": "31-07-1980",
  "yearOfBirth": 1980,
  "wizard": true,
  "ancestry": "half-blood",
  "eyeColour": "green",
  "hairColour": "black",
  "wand": { "wood": "holly", "core": "phoenix tail feather", "length": 11 },
  "patronus": "stag",
  "hogwartsStudent": true,
  "hogwartsStaff": false,
  "actor": "Daniel Radcliffe",
  "alternate_actors": [],
  "alive": true,
  "image": "https://ik.imagekit.io/hpapi/harry.jpg"
}
```

Field semantics:

| Field | Type | Unknown value |
|---|---|---|
| `id` | string | — (always present) |
| `name` | string | — (always present) |
| `alternate_names` | string[] | `[]` |
| `species` | string | `""` (rare; "human", "ghost", "goblin", ...) |
| `gender` | string | `""` (4/437) |
| `house` | string | `""` (302/437) |
| `dateOfBirth` | string ("dd-mm-yyyy") \| null | `null` (417/437), `""` (1/437) |
| `yearOfBirth` | number \| null | `null` (414/437) |
| `wizard`, `hogwartsStudent`, `hogwartsStaff`, `alive` | boolean | — |
| `ancestry` | string | `""` (325/437) |
| `eyeColour` | string | `""` (370/437) |
| `hairColour` | string | `""` (309/437) |
| `wand` | object, never null | `{ "wood": "", "core": "", "length": null }` (412/437) |
| `patronus` | string | `""` (419/437) |
| `actor` | string | `""` (244/437) |
| `alternate_actors` | string[] | `[]` |
| `image` | string (https URL) | `""` (412/437; the 25 populated images are served by `ik.imagekit.io` and load fine) |

#### Errors

- **404** (`/api/characters/:id`, unknown routes): `text/html` body
  `Sorry can't find that!` — **not JSON**.
- **500** / connection failure: the instance may be cold-starting.

### Get Character

**Does not exist.** `GET /api/characters/:id` returns `404 Sorry can't find
that!` even for ids taken directly from the list response (verified with 4
real UUIDs). There is no detail endpoint on this deployment.

**Application strategy**: the detail view reads from the already-fetched
full list (`['characters']` TanStack Query cache, lookup by `id`). No fake
endpoint is called.

### Other verified endpoints (not used)

| Endpoint | Status |
|---|---|
| `GET /api/characters/students` | 200 |
| `GET /api/characters/staff` | 200 |
| `GET /api/characters/house/:house` | 200 |

## Spells

### Get Spells

```
GET /api/spells
```

#### Query Parameters

None supported (same behavior as characters: ignored).

#### Response

`200 OK`, `application/json` — a JSON **array** of 77 spell objects. All
fields are non-empty in practice (verified). Representative record:

```json
{
  "id": "c76a2922-ba4c-4278-baab-44defb631236",
  "name": "Aberto",
  "description": "Opens locked doors"
}
```

#### Errors

Same as characters: non-2xx responses are plain-text `text/html`, e.g.
`404 Sorry can't find that!`.

## Pagination

**Not supported by the API.** The full collection is returned in a single
response (437 characters ≈ 182 KB, 77 spells ≈ 10 KB). The server-side
pagination parameters do not exist and are ignored if sent.

**Application strategy** — pagination is purely presentational:

```
Fetch full dataset (TanStack Query, cached)
        ↓
Filter / search locally (URL state via nuqs)
        ↓
Paginate displayed results (client-side)
```

## Search

**Not supported by the API.** There is no search query parameter.

**Application strategy**: client-side name search over the loaded list
(`searchCharacters` in `src/features/characters/utils.ts` —
case-insensitive substring match on `name` and `alternate_names`).

## Filtering

**Partially supported by the API.** House filtering has a dedicated
endpoint — `GET /api/characters/house/:house` (case-insensitive, unknown
house → `[]`). The list endpoint itself accepts no filter parameters.

**Application strategy**: the house filter calls the endpoint through
TanStack Query (`['characters', 'house', house]`), so selecting a house
fetches only that house's records. Known house values: `Gryffindor`,
`Slytherin`, `Hufflepuff`, `Ravenclaw` (135 records total; the remaining
302 have no house and are unreachable through the endpoint). Search and
pagination apply client-side over whichever list is loaded.

## Houses

**No endpoint.** `GET /api/houses` and `GET /api/houses/:id` both return
`404 Sorry can't find that!` (verified 2026-09-02). There is no house
collection or house detail data on this deployment.

**Application strategy**: the house list is derived from character data —
`getHouseList` in `src/features/houses/utils.ts` returns the distinct
non-null `house` values (Gryffindor, Hufflepuff, Ravenclaw, Slytherin),
canonically ordered. Visual accents come from the same module
(`getHouseStyles`, a canonical color map). No fake house endpoint or
invented house descriptions are used.

## Data Normalization

The API encodes "unknown" as `""` for most string fields and `null` for
`dateOfBirth`, `yearOfBirth`, and `wand.length`. Raw records are validated
with Zod at the API boundary, then normalized once into a UI-ready shape:

- `""` → `null` for every string field (`normalizeCharacter`).
- Empty wand shells (`{ wood: "", core: "", length: null }`) → `wand: null`.
- `dateOfBirth` stays a `"dd-mm-yyyy"` string; not parsed into a `Date`.

Spells need no normalization (all 77 records are fully populated) — the
domain type is the raw API type.

## Error Handling

All API access goes through `getJSON` in `src/lib/api-client.ts`, which
throws a single application error type:

```ts
class ApiError extends Error {
  status?: number; // HTTP status when the API responded
  // message: network note, the API's plain-text body (e.g. "Sorry can't
  // find that!"), or a parsing/validation message
}
```

UI states map to TanStack Query statuses: `loading` → `isPending`,
`error` → `ApiError` surfaced via `error`, and an empty result set (e.g. a
filter matching nothing) is a successful query with a zero-length array.

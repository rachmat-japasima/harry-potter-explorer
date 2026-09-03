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

```
GET /api/character/:id
```

**Singular `/api/character`** (verified live 2026-09-03). `200 OK`, a JSON
**array** containing at most one character record, same shape as the list.
Unknown id → `200 []` (no 404). The plural form `GET /api/characters/:id`
returns `404 Sorry can't find that!` — the singular form is the only detail
route on this deployment.

**Application strategy**: the detail route shell passes the URL id to a
client component, which fetches this endpoint directly (`getCharactersById`
in `src/features/characters/api.ts`). `[]` → not-found state; request
failure → error state with retry.

### Get Students

```
GET /api/characters/students
```

**Query Parameters**: none — ignored, same as `/api/characters` (verified:
`?house=gryffindor` still returns all 103 students).

**Response**: `200 OK`, a JSON **array** of 103 character records, identical
shape to Get Characters. Every record has `"hogwartsStudent": true` (and
`"hogwartsStaff": false`). Same Zod validation and normalization apply.

**Errors**: same as Get Characters (plain-text `text/html` bodies).

### Get Staff

```
GET /api/characters/staff
```

**Query Parameters**: none — ignored (verified: `?page=1&limit=2` still
returns all 25 staff).

**Response**: `200 OK`, a JSON **array** of 25 character records, identical
shape to Get Characters. Every record has `"hogwartsStaff": true` (and
`"hogwartsStudent": false`).

**Errors**: same as Get Characters.

### Other verified endpoints (not used)

| Endpoint | Status |
|---|---|
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
Fetch full dataset at build time (SSG), hydrate into TanStack Query
        ↓
Filter / search locally (URL state via nuqs)
        ↓
Paginate displayed results (client-side)
```

## Search

**Not supported by the API.** There is no search query parameter.

**Application strategy**: client-side search over the loaded list —
`searchCharacters` in `src/features/characters/utils.ts` (name +
`alternate_names`) and `searchSpells` in `src/features/spells/utils.ts`
(name + description). Both are case-insensitive substring matches.

## Filtering

**Partially supported by the API.** House filtering has a dedicated
endpoint — `GET /api/characters/house/:house` (case-insensitive, unknown
house → `[]`). The list endpoint itself accepts no filter parameters, and
the students/staff endpoints ignore them too (verified).

**Application strategy**: filters are a two-dimension system — Character
Type (`all` / `students` / `staff`, URL `?type=…`) and House (`?house=…`).

- `type=all` (default): house filter calls the house endpoint through
  TanStack Query (`['characters', 'house', house]`); no house selected
  means the full list (`['characters']`).
- `type=students` / `type=staff`: fetches the type endpoint
  (`['characters', 'students']` / `['characters', 'staff']`); a house
  selection then filters that list client-side, because the type endpoints
  ignore query parameters. The house endpoint is not called in this mode.

Known house values: `Gryffindor`, `Slytherin`, `Hufflepuff`, `Ravenclaw`
(135 records total; the remaining 302 have no house and are unreachable
through the endpoint). Search and pagination always apply client-side over
whichever list is loaded.

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

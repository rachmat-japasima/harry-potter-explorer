import { describe, expect, it } from "vitest";
import { apiCharacterSchema } from "./schema";
import { normalizeCharacter, searchCharacters } from "./utils";

// Fixtures are verbatim records from the live API (2026-09-01):
// a fully-populated main character and an "everything unknown" record.
const harry = {
  id: "9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8",
  name: "Harry Potter",
  alternate_names: ["The Boy Who Lived", "The Chosen One", "Undesirable No. 1", "Potty"],
  species: "human",
  gender: "male",
  house: "Gryffindor",
  dateOfBirth: "31-07-1980",
  yearOfBirth: 1980,
  wizard: true,
  ancestry: "half-blood",
  eyeColour: "green",
  hairColour: "black",
  wand: { wood: "holly", core: "phoenix tail feather", length: 11 },
  patronus: "stag",
  hogwartsStudent: true,
  hogwartsStaff: false,
  actor: "Daniel Radcliffe",
  alternate_actors: [],
  alive: true,
  image: "https://ik.imagekit.io/hpapi/harry.jpg",
};

const mrCrabbe = {
  id: "32923dab-16e1-4da1-8af7-bf9bec9ece1b",
  name: "Mr Crabbe",
  alternate_names: [],
  species: "human",
  gender: "male",
  house: "",
  dateOfBirth: null,
  yearOfBirth: null,
  wizard: true,
  ancestry: "pure-blood",
  eyeColour: "",
  hairColour: "",
  wand: { wood: "", core: "", length: null },
  patronus: "",
  hogwartsStudent: false,
  hogwartsStaff: false,
  actor: "Paschal Friel",
  alternate_actors: [],
  alive: false,
  image: "",
};

describe("apiCharacterSchema", () => {
  it("parses a fully-populated record from the live API", () => {
    expect(() => apiCharacterSchema.parse(harry)).not.toThrow();
  });

  it("parses the 'everything unknown' shape (empty strings and nulls)", () => {
    expect(() => apiCharacterSchema.parse(mrCrabbe)).not.toThrow();
  });
});

describe("normalizeCharacter", () => {
  it("collapses empty strings and empty wand shells to null", () => {
    const character = normalizeCharacter(apiCharacterSchema.parse(mrCrabbe));
    expect(character.house).toBeNull();
    expect(character.image).toBeNull();
    expect(character.patronus).toBeNull();
    expect(character.wand).toBeNull();
    expect(character.eyeColour).toBeNull();
  });

  it("keeps populated values intact", () => {
    const character = normalizeCharacter(apiCharacterSchema.parse(harry));
    expect(character.house).toBe("Gryffindor");
    expect(character.dateOfBirth).toBe("31-07-1980");
    expect(character.wand).toEqual({
      wood: "holly",
      core: "phoenix tail feather",
      length: 11,
    });
    expect(character.alive).toBe(true);
  });
});

const harryNorm = normalizeCharacter(apiCharacterSchema.parse(harry));
const crabbeNorm = normalizeCharacter(apiCharacterSchema.parse(mrCrabbe));

describe("searchCharacters", () => {
  it("matches name case-insensitively", () => {
    expect(searchCharacters([harryNorm, crabbeNorm], "hARRY")).toEqual([
      harryNorm,
    ]);
  });

  it("matches alternate names", () => {
    expect(searchCharacters([harryNorm, crabbeNorm], "chosen one")).toEqual([
      harryNorm,
    ]);
  });

  it("returns the input unchanged for an empty query", () => {
    expect(searchCharacters([harryNorm, crabbeNorm], "   ")).toHaveLength(2);
  });

  it("returns [] when nothing matches", () => {
    expect(searchCharacters([harryNorm, crabbeNorm], "voldemort")).toEqual([]);
  });
});

import type { Character } from "@/features/characters/types";
import type { Spell } from "@/features/spells/types";

/** Fully populated Gryffindor character (no image → exercises fallback). */
export const harry: Character = {
  id: "harry-1",
  name: "Harry Potter",
  alternate_names: ["The Boy Who Lived"],
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
  image: null,
};

/** Gryffindor character with an image URL. */
export const hermione: Character = {
  id: "hermione-1",
  name: "Hermione Granger",
  alternate_names: [],
  species: "human",
  gender: "female",
  house: "Gryffindor",
  dateOfBirth: "19-09-1979",
  yearOfBirth: 1979,
  wizard: true,
  ancestry: "muggle-born",
  eyeColour: "brown",
  hairColour: "brown",
  wand: { wood: "vine", core: "dragon heartstring", length: 10.75 },
  patronus: "otter",
  hogwartsStudent: true,
  hogwartsStaff: false,
  actor: "Emma Watson",
  alternate_actors: [],
  alive: true,
  image: "https://ik.imagekit.io/hpapi/hermione.jpeg",
};

/** Slytherin character. */
export const draco: Character = {
  id: "draco-1",
  name: "Draco Malfoy",
  alternate_names: [],
  species: "human",
  gender: "male",
  house: "Slytherin",
  dateOfBirth: "05-06-1980",
  yearOfBirth: 1980,
  wizard: true,
  ancestry: "pure-blood",
  eyeColour: "grey",
  hairColour: "blonde",
  wand: { wood: "hawthorn", core: "unicorn tail-hair", length: 10 },
  patronus: null,
  hogwartsStudent: true,
  hogwartsStaff: false,
  actor: "Tom Felton",
  alternate_actors: [],
  alive: true,
  image: null,
};

/** Sparse character — most optional fields unknown. */
export const minimal: Character = {
  id: "minimal-1",
  name: "Nearly Headless Nick",
  alternate_names: [],
  species: "ghost",
  gender: "male",
  house: "Gryffindor",
  dateOfBirth: null,
  yearOfBirth: null,
  wizard: false,
  ancestry: null,
  eyeColour: null,
  hairColour: null,
  wand: null,
  patronus: null,
  hogwartsStudent: false,
  hogwartsStaff: false,
  actor: null,
  alternate_actors: [],
  alive: true,
  image: null,
};

/** Fully populated spell. */
export const lumos: Spell = {
  id: "lumos-1",
  name: "Lumos",
  description: "A light spell that illuminates the caster's wand",
};

/** Spell with a longer description — exercises card text wrapping. */
export const incendio: Spell = {
  id: "incendio-1",
  name: "Incendio",
  description:
    "A fire-making spell that produces a jet of flames from the tip of the caster's wand; useful for heating and cooking, but dangerous when misused",
};

/** Spell matched by description rather than name. */
export const expectoPatronum: Spell = {
  id: "patronum-1",
  name: "Expecto Patronum",
  description:
    "Conjures a silvery guardian called a Patronus to repel Dementors",
};

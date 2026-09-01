import { CharacterCard } from "@/components/characters/character-card";
import type { Character } from "@/features/characters/types";

/** Responsive character grid: 1 / 2 / 3 / 4 columns across breakpoints. */
export function CharacterGrid({ characters }: { characters: Character[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {characters.map((character) => (
        <li key={character.id} className="min-w-0">
          <CharacterCard character={character} />
        </li>
      ))}
    </ul>
  );
}

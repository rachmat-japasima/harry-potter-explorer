import { SpellCard } from "@/components/spells/spell-card";
import type { Spell } from "@/features/spells/types";

/** Responsive spell grid: 1 / 2 / 3 columns across breakpoints. */
export function SpellGrid({ spells }: { spells: Spell[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {spells.map((spell) => (
        <li key={spell.id} className="min-w-0">
          <SpellCard spell={spell} />
        </li>
      ))}
    </ul>
  );
}

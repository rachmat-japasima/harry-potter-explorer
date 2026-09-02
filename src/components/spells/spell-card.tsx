import type { Spell } from "@/features/spells/types";

/**
 * Spell card — name + description. Not a link: the API has no spell detail
 * endpoint, so the explorer is the whole feature.
 */
export function SpellCard({ spell }: { spell: Spell }) {
  return (
    <article className="flex h-full flex-col gap-2 rounded-lg border border-border/60 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg">
      <h3 className="font-heading text-base font-semibold leading-snug">
        {spell.name}
      </h3>
      <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
        {spell.description}
      </p>
    </article>
  );
}

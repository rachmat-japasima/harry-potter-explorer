import Link from "next/link";

import { CharacterImage } from "@/components/characters/character-image";
import { getHouseStyles } from "@/features/houses/utils";
import type { Character } from "@/features/characters/types";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Character card — the whole card is a semantic link to the detail page.
 * Shows image, name, house badge, and a species · gender line only.
 */
export function CharacterCard({ character }: { character: Character }) {
  const houseStyles = getHouseStyles(character.house);
  const meta = [character.species, character.gender]
    .filter((value): value is string => value !== null)
    .map(capitalize)
    .join(" · ");

  return (
    <Link
      href={`/characters/${character.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative overflow-hidden">
        <CharacterImage
          name={character.name}
          image={character.image}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "aspect-[3/4]",
            "origin-center transform-gpu",
            "transition-all duration-[800ms]",
            "ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover:scale-[1.08]",
            "group-hover:grayscale",
          )}
        />
        {/* Hover overlay */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            "flex items-center justify-center",
            "bg-black/30",
            "opacity-0",
            "transition-opacity duration-500 ease-out",
            "group-hover:opacity-100",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-full",
              "bg-black/40 px-4 py-2 text-white backdrop-blur-sm",
              "translate-y-3 opacity-0",
              "transition-[transform,opacity] duration-500",
              "ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:translate-y-0 group-hover:opacity-100",
            )}
          >
            <Search className="size-4" aria-hidden="true" />{" "}
            <span>See details</span>{" "}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-heading text-base font-semibold leading-snug group-hover:text-accent-foreground dark:group-hover:text-accent">
          {character.name}
        </h2>
        <div className="flex justify-between gap-2 text-muted-foreground">
          {meta && (
            <p className="mt-auto pt-1 text-xs text-muted-foreground">{meta}</p>
          )}
          {character.house && (
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                houseStyles.badge,
              )}
            >
              {character.house}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

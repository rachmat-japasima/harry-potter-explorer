import type { Character } from "@/features/characters/types";

/**
 * Houses. The deployment serves no /api/houses endpoint (404, verified
 * 2026-09-02), so the house list is derived from character data and the
 * visual identity is a canonical accent map — no invented descriptions.
 */

const CANONICAL_HOUSES = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];

/** Distinct houses present in the loaded characters, canonical order first. */
export function getHouseList(characters: Character[]): string[] {
  const present = [
    ...new Set(
      characters
        .map((c) => c.house)
        .filter((house): house is string => house !== null),
    ),
  ];
  const rank = new Map(CANONICAL_HOUSES.map((name, i) => [name, i]));
  return present.sort(
    (a, b) =>
      (rank.get(a) ?? Infinity) - (rank.get(b) ?? Infinity) ||
      a.localeCompare(b),
  );
}

/** URL representation — task-example style lowercase slugs. */
export function houseToSlug(house: string): string {
  return house.toLowerCase();
}

/** Display name from a slug; unknown slugs round-trip as capitalized. */
export function slugToHouseName(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export interface HouseStyles {
  /** Small badge (card / detail house label). */
  badge: string;
  /** Selected filter chip. */
  chipActive: string;
  /** Color dot so house identity reads as color even at small sizes. */
  dot: string;
}

const STYLES: Record<string, HouseStyles> = {
  Gryffindor: {
    badge:
      "bg-red-600/10 text-red-700 ring-red-600/25 dark:bg-red-500/15 dark:text-red-400 dark:ring-red-400/30",
    chipActive: "bg-red-700 text-white ring-red-700 dark:bg-red-500 dark:ring-red-400",
    dot: "bg-red-600 dark:bg-red-400",
  },
  Hufflepuff: {
    badge:
      "bg-amber-500/10 text-amber-700 ring-amber-600/25 dark:bg-amber-500/15 dark:text-amber-400 dark:ring-amber-400/30",
    chipActive:
      "bg-amber-600 text-white ring-amber-600 dark:bg-amber-500 dark:ring-amber-400",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  Ravenclaw: {
    badge:
      "bg-blue-600/10 text-blue-700 ring-blue-600/25 dark:bg-blue-500/15 dark:text-blue-400 dark:ring-blue-400/30",
    chipActive: "bg-blue-700 text-white ring-blue-700 dark:bg-blue-500 dark:ring-blue-400",
    dot: "bg-blue-600 dark:bg-blue-400",
  },
  Slytherin: {
    badge:
      "bg-emerald-600/10 text-emerald-700 ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-400/30",
    chipActive:
      "bg-emerald-700 text-white ring-emerald-700 dark:bg-emerald-500 dark:ring-emerald-400",
    dot: "bg-emerald-600 dark:bg-emerald-400",
  },
};

const NEUTRAL: HouseStyles = {
  badge: "bg-muted text-muted-foreground ring-border",
  chipActive: "bg-foreground text-background ring-foreground",
  dot: "bg-muted-foreground",
};

/** Accent styles for a house; houses outside the canonical four get neutral. */
export function getHouseStyles(house: string | null): HouseStyles {
  return (house && STYLES[house]) || NEUTRAL;
}

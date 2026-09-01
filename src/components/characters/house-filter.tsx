"use client";

import { parseAsInteger, useQueryState } from "nuqs";

import { getHouseStyles, houseToSlug } from "@/features/houses/utils";
import { cn } from "@/lib/utils";

/**
 * House filter chips. Houses come from the API-backed character data
 * (there is no /api/houses endpoint on this deployment). Selection lives
 * in the URL (?house=gryffindor); aria-pressed conveys state — not color
 * alone.
 */
export function HouseFilter({ houses }: { houses: string[] }) {
  const [house, setHouse] = useQueryState("house", {
    defaultValue: "",
    clearOnDefault: true,
  });
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const selectHouse = (slug: string) => {
    setHouse(slug === "" ? null : slug);
    setPage(1);
  };

  const chipBase =
    "inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium ring-1 ring-inset ring-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <div
      role="group"
      aria-label="Filter by house"
      className="flex flex-wrap gap-2"
    >
      <button
        type="button"
        aria-pressed={house === ""}
        onClick={() => selectHouse("")}
        className={cn(
          chipBase,
          house === ""
            ? "bg-foreground text-background cursor-pointer"
            : "bg-background text-muted-foreground hover:bg-muted",
        )}
      >
        All
      </button>
      {houses.map((name) => {
        const slug = houseToSlug(name);
        const styles = getHouseStyles(name);
        const active = house === slug;
        return (
          <button
            key={slug}
            type="button"
            aria-pressed={active}
            onClick={() => selectHouse(slug)}
            className={cn(
              chipBase,
              active
                ? styles.chipActive
                : "bg-background text-muted-foreground hover:bg-muted cursor-pointer",
            )}
          >
            <span
              aria-hidden
              className={cn("size-1.5 rounded-full", styles.dot)}
            />
            {name}
          </button>
        );
      })}
    </div>
  );
}

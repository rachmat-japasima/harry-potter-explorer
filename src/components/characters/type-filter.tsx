"use client";

import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";

import { cn } from "@/lib/utils";

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "students", label: "Students" },
  { value: "staff", label: "Staff" },
] as const;

type TypeValue = (typeof TYPE_OPTIONS)[number]["value"];

/**
 * Character type filter — a second dimension alongside House. Selection
 * lives in the URL (?type=students|staff, absent for All); aria-pressed
 * conveys state, not color alone. Changing type resets the page to 1.
 */
export function TypeFilter() {
  const [type, setType] = useQueryState(
    "type",
    parseAsStringLiteral(["all", "students", "staff"] as const).withDefault(
      "all",
    ),
  );
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const selectType = (value: TypeValue) => {
    setType(value === "all" ? null : value);
    setPage(1);
  };

  const chipBase =
    "inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium ring-1 ring-inset ring-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <div
      role="group"
      aria-label="Filter by character type"
      className="flex flex-wrap gap-2"
    >
      {TYPE_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={type === value}
          onClick={() => selectType(value)}
          className={cn(
            chipBase,
            type === value
              ? "bg-foreground text-background cursor-pointer"
              : "bg-background text-muted-foreground hover:bg-muted cursor-pointer",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

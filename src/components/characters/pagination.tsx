"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

/**
 * Client-side pagination (the API returns whole collections). Current page
 * lives in the URL (?page=N). Hidden when everything fits on one page.
 */
export function Pagination({
  totalItems,
  pageSize,
}: {
  totalItems: number;
  pageSize: number;
}) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);

  // Keep the URL honest when a deep link or filter change lands past the
  // last page; runs before the single-page early return below.
  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount, setPage]);

  if (pageCount <= 1) return null;

  // Clamped to [1, pageCount]; invalid input (e.g. empty) is ignored.
  const handleJump = (value: string) => {
    const target = Number.parseInt(value, 10);
    if (!Number.isNaN(target)) {
      setPage(Math.min(Math.max(1, target), pageCount));
    }
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={current <= 1}
        onClick={() => setPage(current - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden />
        Previous
      </Button>
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{current}</span> of{" "}
        {pageCount}
      </p>
      {/* Uncontrolled input keyed by `current`: remounting resets its value
          when the page changes, so no state-sync effect is needed. */}
      <form
        aria-label="Jump to page"
        className="flex items-center gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          handleJump(String(form.get("jump-to") ?? ""));
        }}
      >
        <label htmlFor="jump-to" className="sr-only">
          Jump to page
        </label>
        <input
          id="jump-to"
          name="jump-to"
          type="number"
          min={1}
          max={pageCount}
          key={current}
          defaultValue={current}
          className="h-8 w-14 rounded-md border border-input bg-background px-2 text-center text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        <Button type="submit" variant="outline" size="sm">
          Go
        </Button>
      </form>
      <Button
        variant="outline"
        size="sm"
        disabled={current >= pageCount}
        onClick={() => setPage(current + 1)}
      >
        Next
        <ChevronRight className="size-4" aria-hidden />
      </Button>
    </nav>
  );
}

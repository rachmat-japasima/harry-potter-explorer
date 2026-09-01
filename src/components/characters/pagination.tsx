"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";

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

  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-4 pt-2"
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
        Page{" "}
        <span className="font-medium text-foreground">{current}</span> of{" "}
        {pageCount}
      </p>
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

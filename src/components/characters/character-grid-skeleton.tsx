import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton mirror of the character grid — same columns and card shape so
 * the layout does not jump between loading and loaded states.
 */
export function CharacterGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-border/60 bg-card"
        >
          <Skeleton className="aspect-[3/4] rounded-none border-0" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading characters…</span>
    </div>
  );
}

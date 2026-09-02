import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton mirror of the spell grid — same columns and card shape so the
 * layout does not jump between loading and loaded states.
 */
export function SpellGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border/60 bg-card p-5"
        >
          <Skeleton className="h-4 w-2/3 rounded-md" />
          <Skeleton className="mt-3 h-3 w-full rounded-md" />
          <Skeleton className="mt-2 h-3 w-4/5 rounded-md" />
        </div>
      ))}
      <span className="sr-only">Loading spells…</span>
    </div>
  );
}

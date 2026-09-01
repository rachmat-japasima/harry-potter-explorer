import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic skeleton placeholder while content loads. Feature pages compose
 * their own skeletons for grids; this covers the common header + body shape.
 */
export function LoadingState({ label = "Loading content" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-1/2 max-w-sm" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
      </div>
      <span className="sr-only">{label}…</span>
    </div>
  );
}

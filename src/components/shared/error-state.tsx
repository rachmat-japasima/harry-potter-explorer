import type { ReactNode } from "react";

/**
 * Shown when a request fails. `action` is typically a "Try again" button
 * wired to a query refetch by the caller.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-16 text-center"
    >
      <h2 className="font-heading text-lg font-medium">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

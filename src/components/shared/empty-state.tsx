import type { ReactNode } from "react";

/**
 * Shown when a query succeeds but yields nothing (e.g. no search matches).
 * `action` is whatever reset/clear control the caller wants, rendered as-is.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-16 text-center">
      <h2 className="font-heading text-lg font-medium">{title}</h2>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

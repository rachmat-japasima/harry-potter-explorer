import { cn } from "@/lib/utils";

/**
 * Shared page shell: maximum content width with consistent responsive
 * horizontal padding. Used by every route (home, characters, spells).
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

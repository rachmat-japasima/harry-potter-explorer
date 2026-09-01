/**
 * Consistent page title + description for feature pages (characters, spells).
 */
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-prose text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

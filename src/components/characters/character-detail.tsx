"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CharacterImage } from "@/components/characters/character-image";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCharacter } from "@/features/characters/queries";
import type { Character } from "@/features/characters/types";
import { getHouseStyles } from "@/features/houses/utils";
import { cn } from "@/lib/utils";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Character detail. The API has no detail endpoint, so the record comes
 * from the full-list TanStack Query cache (see features/characters/queries).
 * Only fields with meaningful data render.
 */
export function CharacterDetail({ id }: { id: string }) {
  const { character, isPending, isError, isNotFound, refetch } =
    useCharacter(id);

  return (
    <Container className="py-10 sm:py-16">
      <Link
        href="/characters"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Characters
      </Link>

      {isPending && <DetailSkeleton />}

      {isError && (
        <ErrorState
          title="Something went wrong"
          description="We couldn't load this character."
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      )}

      {isNotFound && (
        <EmptyState
          title="Character not found"
          description="We couldn't find this character."
          action={
            <Link href="/characters" className={buttonVariants()}>
              Back to Characters
            </Link>
          }
        />
      )}

      {character && <DetailLayout character={character} />}
    </Container>
  );
}

function DetailLayout({ character }: { character: Character }) {
  const houseStyles = getHouseStyles(character.house);

  const facts: [string, string][] = [
    ["Actor", character.actor],
    ["Species", character.species],
    ["Gender", character.gender],
    ["Date of birth", character.dateOfBirth],
    ["Ancestry", character.ancestry],
    ["Patronus", character.patronus],
  ].filter((entry): entry is [string, string] => entry[1] !== null);

  const statuses = [
    character.hogwartsStudent && "Hogwarts student",
    character.hogwartsStaff && "Hogwarts staff",
  ].filter((s): s is string => Boolean(s));

  return (
    <article className="mt-8 grid gap-8 md:grid-cols-[300px_1fr] md:gap-12">
      <CharacterImage
        name={character.name}
        image={character.image}
        sizes="(min-width: 768px) 300px, 100vw"
        priority
        fallbackClassName="text-6xl"
        className="aspect-[3/4] rounded-lg shadow-card ring-1 ring-border/60"
      />

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {character.name}
        </h1>

        {character.house && (
          <span
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
              houseStyles.badge,
            )}
          >
            <span aria-hidden className={cn("size-1.5 rounded-full", houseStyles.dot)} />
            {character.house}
          </span>
        )}

        {statuses.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <span
                key={status}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {status}
              </span>
            ))}
          </div>
        )}

        {facts.length > 0 && (
          <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="border-b border-border/50 pb-2"
              >
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm">{capitalize(value)}</dd>
              </div>
            ))}
          </dl>
        )}

        {character.wand && (
          <section aria-labelledby="wand-heading" className="mt-10">
            <h2
              id="wand-heading"
              className="font-heading text-lg font-semibold tracking-tight"
            >
              Wand
            </h2>
            <dl className="mt-3 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
              {character.wand.wood && (
                <div className="border-b border-border/50 pb-2">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Wood
                  </dt>
                  <dd className="mt-0.5 text-sm">{capitalize(character.wand.wood)}</dd>
                </div>
              )}
              {character.wand.core && (
                <div className="border-b border-border/50 pb-2">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Core
                  </dt>
                  <dd className="mt-0.5 text-sm">{capitalize(character.wand.core)}</dd>
                </div>
              )}
              {character.wand.length !== null && (
                <div className="border-b border-border/50 pb-2">
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Length
                  </dt>
                  <dd className="mt-0.5 text-sm">{character.wand.length}&quot;</dd>
                </div>
              )}
            </dl>
          </section>
        )}
      </div>
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[300px_1fr] md:gap-12" role="status">
      <Skeleton className="aspect-[3/4] rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-9 w-2/3 max-w-xs" />
        <Skeleton className="h-5 w-24" />
        <div className="grid max-w-2xl grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading character…</span>
    </div>
  );
}

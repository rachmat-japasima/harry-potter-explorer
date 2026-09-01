"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface CharacterImageProps {
  name: string;
  /** Normalized domain image URL — may be null. */
  image: string | null;
  /** Wrapper classes; enforces the aspect ratio (e.g. aspect-[3/4]). */
  className?: string;
  /** next/image sizes hint for responsive sources. */
  sizes: string;
  /** Scale of the fallback monogram. */
  fallbackClassName?: string;
  priority?: boolean;
}

/**
 * Character portrait with a consistent fallback for null or broken images:
 * a muted panel with the character's initial. The wrapper's aspect ratio
 * is fixed by the caller so layout does not shift while loading.
 */
export function CharacterImage({
  name,
  image,
  className,
  sizes,
  fallbackClassName,
  priority,
}: CharacterImageProps) {
  const [broken, setBroken] = useState(false);
  const showImage = image !== null && !broken;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {showImage ? (
        <Image
          src={image}
          alt={`${name} portrait`}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setBroken(true)}
          className="object-cover object-top"
        />
      ) : (
        <div
          aria-hidden
          className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-background"
        >
          <span
            className={cn(
              "font-heading font-semibold text-muted-foreground/40",
              fallbackClassName ?? "text-4xl",
            )}
          >
            {name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

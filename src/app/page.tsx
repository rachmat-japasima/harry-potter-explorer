import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

/**
 * Home hero — cinematic full-bleed video background. The video is
 * decorative (aria-hidden); overlays carry legibility and the bottom fade
 * blends the hero into the page background. Under prefers-reduced-motion
 * the video is hidden and the scrim layers stand in.
 */
export default function Home() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden">
      {/* Ground behind the video (shown if it is slow, hidden by
          reduced-motion, or not supported). */}
      <div aria-hidden className="absolute inset-0 bg-neutral-950" />

      <video
        aria-hidden
        tabIndex={-1}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/assets/videos/bg-video.mp4"
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
      />

      {/* Uniform scrim for text legibility… */}
      <div aria-hidden className="absolute inset-0 bg-black/50" />
      {/* …then the bottom melts into the page background. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"
      />
      {/* Warm brand glow over the video. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--accent),transparent_70%)] opacity-25 mix-blend-screen"
      />

      <Container className="relative flex flex-col items-center py-24 text-center sm:py-32">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
          Wizarding World Explorer
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold tracking-tight text-balance text-white drop-shadow-lg sm:text-6xl">
          Explore the Wizarding World
        </h1>
        <p className="mt-5 max-w-xl text-lg text-balance text-white/80">
          Discover the witches, wizards, houses, and spells of the Harry Potter
          universe.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button className="h-11 bg-white px-6 text-neutral-950 hover:bg-white/90 dark:text-foreground dark:bg-background dark:hover:bg-background/70">
            <Link href="/characters">Explore Characters</Link>
          </Button>
          <Button
            className="h-11 border-white/50 px-6 text-white hover:bg-white/10"
            variant="ghost"
          >
            <Link href="/spells">Explore Spells</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

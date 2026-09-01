"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/characters", label: "Characters" },
  { href: "/spells", label: "Spells" },
] as const;

/**
 * Collapsible navigation panel for small screens. Rendered below the header
 * bar; closes on Escape, link click, or route change. Keyboard focus moves
 * into the panel when it opens and returns to the toggle when it closes.
 */
export function MobileNav({
  open,
  onClose,
  toggleRef,
}: {
  open: boolean;
  onClose: () => void;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpened = useRef(false);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Move focus into the panel on open, back to the toggle on close.
  useEffect(() => {
    if (open) {
      wasOpened.current = true;
      panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    } else if (wasOpened.current) {
      toggleRef.current?.focus();
    }
  }, [open, toggleRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          ref={panelRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
        >
          <Container>
            <nav aria-label="Mobile">
              <ul className="flex flex-col py-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "block rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2",
                        pathname.startsWith(link.href) && "bg-muted text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

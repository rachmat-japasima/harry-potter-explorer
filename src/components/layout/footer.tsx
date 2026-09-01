import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <Container className="flex flex-col gap-1 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="font-heading text-sm font-semibold tracking-tight">
          Harry Potter Explorer
        </p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Built as a frontend take-home assignment. Data provided by the
            Harry Potter API.
          </p>
          <ThemeToggle />
        </div>
      </Container>
    </footer>
  );
}

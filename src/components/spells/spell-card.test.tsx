import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SpellCard } from "@/components/spells/spell-card";
import { incendio, lumos } from "@/test/fixtures";

describe("SpellCard", () => {
  it("renders the spell name and description", () => {
    render(<SpellCard spell={lumos} />);

    expect(
      screen.getByRole("heading", { name: "Lumos" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/illuminates the caster's wand/i)).toBeInTheDocument();
  });

  it("wraps long descriptions without breaking the layout", () => {
    const { container } = render(<SpellCard spell={incendio} />);

    // The description paragraph is a single text node (no truncation or
    // overflow handling), so the long fixture renders in full and wraps.
    expect(screen.getByText(/jet of flames/i)).toHaveTextContent(
      /dangerous when misused/,
    );
    expect(container.querySelector("p")).not.toHaveClass(/truncate|line-clamp/);
  });
});

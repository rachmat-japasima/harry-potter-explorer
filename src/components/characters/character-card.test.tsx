import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CharacterCard } from "@/components/characters/character-card";
import { harry, hermione, minimal } from "@/test/fixtures";

describe("CharacterCard", () => {
  it("renders the character's name, house, and species · gender line", () => {
    render(<CharacterCard character={harry} />);

    expect(
      screen.getByRole("link", { name: /harry potter/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Gryffindor")).toBeInTheDocument();
    expect(screen.getByText("Human · Male")).toBeInTheDocument();
  });

  it("renders the fallback monogram when there is no image", () => {
    render(<CharacterCard character={harry} />);

    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the portrait when one exists", () => {
    render(<CharacterCard character={hermione} />);

    const img = screen.getByRole("img", { name: "Hermione Granger portrait" });
    expect(img).toHaveAttribute(
      "src",
      "https://ik.imagekit.io/hpapi/hermione.jpeg",
    );
  });

  it("omits the house badge when the character has no house", () => {
    render(<CharacterCard character={{ ...minimal, house: null }} />);

    expect(screen.queryByText("Gryffindor")).not.toBeInTheDocument();
  });

  it("links the whole card to the character detail page", () => {
    render(<CharacterCard character={harry} />);

    expect(screen.getByRole("link", { name: /harry potter/i })).toHaveAttribute(
      "href",
      "/characters/harry-1",
    );
  });
});

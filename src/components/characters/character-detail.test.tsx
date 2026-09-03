import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CharacterDetail } from "@/components/characters/character-detail";
import { harry, minimal } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";

const mocks = vi.hoisted(() => ({
  getCharactersById: vi.fn(),
}));

vi.mock("@/features/characters/api", () => ({
  getCharactersById: mocks.getCharactersById,
}));

beforeEach(() => {
  mocks.getCharactersById.mockReset();
});

describe("CharacterDetail", () => {
  it("renders the character with house, facts, and structured wand", async () => {
    mocks.getCharactersById.mockResolvedValue([harry]);
    renderWithProviders(<CharacterDetail id="harry-1" />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Harry Potter" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Gryffindor")).toBeInTheDocument();
    expect(screen.getByText("Actor")).toBeInTheDocument();
    expect(screen.getByText("Daniel Radcliffe")).toBeInTheDocument();
    expect(screen.getByText("Half-blood")).toBeInTheDocument();

    const wand = screen.getByRole("heading", { name: "Wand" });
    expect(wand).toBeInTheDocument();
    expect(screen.getByText("Wood")).toBeInTheDocument();
    expect(screen.getByText("Holly")).toBeInTheDocument();
    expect(screen.getByText("Phoenix tail feather")).toBeInTheDocument();
    expect(screen.getByText('11"')).toBeInTheDocument();
  });

  it("omits fields with no meaningful data", async () => {
    mocks.getCharactersById.mockResolvedValue([minimal]);
    renderWithProviders(<CharacterDetail id="minimal-1" />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Nearly Headless Nick",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ghost")).toBeInTheDocument();
    expect(screen.queryByText("Actor")).not.toBeInTheDocument();
    expect(screen.queryByText("Patronus")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Wand" })).not.toBeInTheDocument();
  });

  it("shows the generic error state and retries", async () => {
    mocks.getCharactersById
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue([harry]);
    renderWithProviders(<CharacterDetail id="harry-1" />);

    expect(
      await screen.findByText("We couldn't load this character."),
    ).toBeInTheDocument();
    // The error state must not double up with the not-found state.
    expect(screen.queryByText("Character not found")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Harry Potter" }),
    ).toBeInTheDocument();
  });

  it("shows the not-found state for an unknown id with a back link", async () => {
    mocks.getCharactersById.mockResolvedValue([]);
    renderWithProviders(<CharacterDetail id="nope-1" />);

    expect(await screen.findByText("Character not found")).toBeInTheDocument();
    const backLinks = screen.getAllByRole("link", {
      name: "Back to Characters",
    });
    // One in the page header, one in the empty-state action.
    expect(backLinks).toHaveLength(2);
    backLinks.forEach((link) =>
      expect(link).toHaveAttribute("href", "/characters"),
    );
  });

  it("provides a back link to the character explorer", async () => {
    mocks.getCharactersById.mockResolvedValue([harry]);
    renderWithProviders(<CharacterDetail id="harry-1" />);

    await screen.findByRole("heading", { level: 1, name: "Harry Potter" });

    expect(
      screen.getByRole("link", { name: /back to characters/i }),
    ).toHaveAttribute("href", "/characters");
  });
});

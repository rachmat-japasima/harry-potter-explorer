import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CharactersExplorer } from "@/components/characters/characters-explorer";
import { draco, harry, hermione } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";

const mocks = vi.hoisted(() => ({
  getCharacters: vi.fn(),
  getHouseCharacters: vi.fn(),
}));

vi.mock("@/features/characters/api", () => ({
  getCharacters: mocks.getCharacters,
  getHouseCharacters: mocks.getHouseCharacters,
}));

const characters = [harry, hermione, draco];

beforeEach(() => {
  mocks.getCharacters.mockReset();
  mocks.getHouseCharacters.mockReset();
});

describe("CharactersExplorer", () => {
  it("shows a skeleton while loading, then renders character cards", async () => {
    mocks.getCharacters.mockResolvedValue(characters);
    renderWithProviders(<CharactersExplorer />);

    expect(screen.getByText("Loading characters…")).toBeInTheDocument();

    expect(
      await screen.findByRole("link", { name: /harry potter/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /hermione granger/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /draco malfoy/i }),
    ).toBeInTheDocument();
  });

  it("renders the error state and retries via refetch", async () => {
    mocks.getCharacters
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue(characters);
    renderWithProviders(<CharactersExplorer />);

    expect(
      await screen.findByText("We couldn't load the characters."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("link", { name: /harry potter/i }),
    ).toBeInTheDocument();
  });

  it("renders the empty state and clears filters from the URL", async () => {
    const onUrlUpdate = vi.fn();
    mocks.getCharacters.mockResolvedValue([]);
    renderWithProviders(<CharactersExplorer />, {
      searchParams: "?search=zzz",
      onUrlUpdate,
    });

    expect(await screen.findByText("No characters found")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ queryString: "" }),
      );
    });
  });

  it("fetches the house endpoint when a house is selected", async () => {
    mocks.getCharacters.mockResolvedValue(characters);
    mocks.getHouseCharacters.mockResolvedValue([harry]);
    renderWithProviders(<CharactersExplorer />, {
      searchParams: "?house=gryffindor",
    });

    expect(
      await screen.findByRole("link", { name: /harry potter/i }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mocks.getHouseCharacters).toHaveBeenCalledWith("gryffindor");
    });
    expect(
      screen.queryByRole("link", { name: /draco malfoy/i }),
    ).not.toBeInTheDocument();
  });

  it("filters by search across the loaded list", async () => {
    mocks.getCharacters.mockResolvedValue(characters);
    renderWithProviders(<CharactersExplorer />);

    await screen.findByRole("link", { name: /harry potter/i });

    // Single change event: userEvent.type fragments against the controlled
    // input (React's value tracker resets the DOM value between keystrokes).
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "harry" },
    });

    // SearchInput's default debounce is 1000ms — outlast waitFor's default.
    await waitFor(
      () => {
        expect(
          screen.queryByRole("link", { name: /hermione granger/i }),
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
    expect(
      screen.getByRole("link", { name: /harry potter/i }),
    ).toBeInTheDocument();
  });
});

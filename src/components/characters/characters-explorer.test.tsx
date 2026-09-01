import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CharactersExplorer } from "@/components/characters/characters-explorer";
import { draco, harry, hermione, minimal } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";

const mocks = vi.hoisted(() => ({
  getCharacters: vi.fn(),
  getHouseCharacters: vi.fn(),
  getStudents: vi.fn(),
  getStaff: vi.fn(),
}));

vi.mock("@/features/characters/api", () => ({
  getCharacters: mocks.getCharacters,
  getHouseCharacters: mocks.getHouseCharacters,
  getStudents: mocks.getStudents,
  getStaff: mocks.getStaff,
}));

const characters = [harry, hermione, draco];

beforeEach(() => {
  mocks.getCharacters.mockReset();
  mocks.getHouseCharacters.mockReset();
  mocks.getStudents.mockReset();
  mocks.getStaff.mockReset();
});

describe("CharactersExplorer", () => {
  it("renders build-time hydrated data without a duplicate client fetch", async () => {
    // Simulate the build: prefetch on a "server" client, then hydrate into
    // the app's client (Infinity staleTime mirrors the real provider).
    const serverClient = new QueryClient();
    mocks.getCharacters.mockResolvedValue(characters);
    await serverClient.fetchQuery({
      queryKey: ["characters"],
      queryFn: mocks.getCharacters,
    });

    const appClient = new QueryClient({
      defaultOptions: { queries: { staleTime: Infinity, retry: false } },
    });
    renderWithProviders(
      <HydrationBoundary state={dehydrate(serverClient)}>
        <CharactersExplorer />
      </HydrationBoundary>,
      { queryClient: appClient },
    );

    expect(
      await screen.findByRole("link", { name: /harry potter/i }),
    ).toBeInTheDocument();
    // One "build-time" call; hydration must not trigger a client refetch.
    expect(mocks.getCharacters).toHaveBeenCalledTimes(1);
  });

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

  it("fetches the students endpoint when Students is selected", async () => {
    mocks.getCharacters.mockResolvedValue(characters);
    mocks.getStudents.mockResolvedValue([harry, hermione]);
    renderWithProviders(<CharactersExplorer />, {
      searchParams: "?type=students",
    });

    expect(
      await screen.findByRole("link", { name: /harry potter/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /hermione granger/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /draco malfoy/i }),
    ).not.toBeInTheDocument();
    expect(mocks.getStudents).toHaveBeenCalledWith();
    expect(mocks.getHouseCharacters).not.toHaveBeenCalled();
  });

  it("fetches the staff endpoint when Staff is selected", async () => {
    mocks.getCharacters.mockResolvedValue(characters);
    mocks.getStaff.mockResolvedValue([minimal]);
    renderWithProviders(<CharactersExplorer />, {
      searchParams: "?type=staff",
    });

    expect(
      await screen.findByRole("link", { name: /nearly headless nick/i }),
    ).toBeInTheDocument();
    expect(mocks.getStaff).toHaveBeenCalledWith();
    expect(mocks.getStudents).not.toHaveBeenCalled();
  });

  it("does not fetch type endpoints when All is selected", async () => {
    mocks.getCharacters.mockResolvedValue(characters);
    renderWithProviders(<CharactersExplorer />);

    await screen.findByRole("link", { name: /harry potter/i });

    expect(mocks.getStudents).not.toHaveBeenCalled();
    expect(mocks.getStaff).not.toHaveBeenCalled();
  });

  it("combines type and house client-side (the API ignores params)", async () => {
    mocks.getCharacters.mockResolvedValue(characters);
    mocks.getStudents.mockResolvedValue([harry, draco]);
    renderWithProviders(<CharactersExplorer />, {
      searchParams: "?type=students&house=gryffindor",
    });

    expect(
      await screen.findByRole("link", { name: /harry potter/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /draco malfoy/i }),
    ).not.toBeInTheDocument();
    expect(mocks.getStudents).toHaveBeenCalledWith();
    expect(mocks.getHouseCharacters).not.toHaveBeenCalled();
  });

  it("resets pagination when the type filter changes", async () => {
    const onUrlUpdate = vi.fn();
    mocks.getCharacters.mockResolvedValue(characters);
    renderWithProviders(<CharactersExplorer />, {
      searchParams: "?page=2",
      onUrlUpdate,
    });

    // The explorer shows a skeleton until data settles, then renders the
    // filters — so await the button (page=2 is empty with the 3-char mock
    // list, but the filters still render above the empty state).
    await userEvent.click(
      await screen.findByRole("button", { name: "Students" }),
    );

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          queryString: expect.stringContaining("type=students"),
        }),
      );
      // page=2 resets to the default (1), which nuqs drops from the URL.
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          queryString: expect.not.stringContaining("page=2"),
        }),
      );
    });
  });

  it("shows a type-specific empty state", async () => {
    mocks.getCharacters.mockResolvedValue(characters);
    mocks.getStudents.mockResolvedValue([]);
    renderWithProviders(<CharactersExplorer />, {
      searchParams: "?type=students",
    });

    expect(await screen.findByText("No students found")).toBeInTheDocument();
  });
});

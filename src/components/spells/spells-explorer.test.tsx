import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SpellsExplorer } from "@/components/spells/spells-explorer";
import { expectoPatronum, incendio, lumos } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";

const mocks = vi.hoisted(() => ({
  getSpells: vi.fn(),
}));

vi.mock("@/features/spells/api", () => ({
  getSpells: mocks.getSpells,
}));

const spells = [lumos, incendio, expectoPatronum];

beforeEach(() => {
  mocks.getSpells.mockReset();
});

describe("SpellsExplorer", () => {
  it("renders build-time hydrated data without a duplicate client fetch", async () => {
    // Simulate the build: prefetch on a "server" client, then hydrate into
    // the app's client (Infinity staleTime mirrors the real provider).
    const serverClient = new QueryClient();
    mocks.getSpells.mockResolvedValue(spells);
    await serverClient.fetchQuery({
      queryKey: ["spells"],
      queryFn: mocks.getSpells,
    });

    const appClient = new QueryClient({
      defaultOptions: { queries: { staleTime: Infinity, retry: false } },
    });
    renderWithProviders(
      <HydrationBoundary state={dehydrate(serverClient)}>
        <SpellsExplorer />
      </HydrationBoundary>,
      { queryClient: appClient },
    );

    expect(await screen.findByText("Lumos")).toBeInTheDocument();
    expect(await screen.findByText("Incendio")).toBeInTheDocument();
    // One "build-time" call; hydration must not trigger a client refetch.
    expect(mocks.getSpells).toHaveBeenCalledTimes(1);
  });

  it("shows a skeleton while loading, then renders spell cards", async () => {
    mocks.getSpells.mockResolvedValue(spells);
    renderWithProviders(<SpellsExplorer />);

    expect(screen.getByText("Loading spells…")).toBeInTheDocument();

    expect(await screen.findByText("Lumos")).toBeInTheDocument();
    expect(screen.getByText("Incendio")).toBeInTheDocument();
    expect(screen.getByText("Expecto Patronum")).toBeInTheDocument();
  });

  it("renders the error state and retries via refetch", async () => {
    mocks.getSpells
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue(spells);
    renderWithProviders(<SpellsExplorer />);

    expect(
      await screen.findByText("We couldn't load the spells."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Lumos")).toBeInTheDocument();
  });

  it("renders the empty state and clears the search from the URL", async () => {
    const onUrlUpdate = vi.fn();
    mocks.getSpells.mockResolvedValue([]);
    renderWithProviders(<SpellsExplorer />, {
      searchParams: "?search=zzz",
      onUrlUpdate,
    });

    expect(await screen.findByText("No spells found")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ queryString: "" }),
      );
    });
  });

  it("filters by search across the loaded list", async () => {
    mocks.getSpells.mockResolvedValue(spells);
    renderWithProviders(<SpellsExplorer />);

    await screen.findByText("Lumos");

    // Single change event: userEvent.type fragments against the controlled
    // input (React's value tracker resets the DOM value between keystrokes).
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "patronus" },
    });

    // SearchInput's default debounce (500ms) plus the query settling —
    // outlast waitFor's default timeout.
    await waitFor(
      () => {
        expect(screen.queryByText("Lumos")).not.toBeInTheDocument();
        expect(screen.queryByText("Incendio")).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
    expect(screen.getByText("Expecto Patronum")).toBeInTheDocument();
  });

  it("matches spells by description as well as name", async () => {
    mocks.getSpells.mockResolvedValue(spells);
    renderWithProviders(<SpellsExplorer />, { searchParams: "?search=light" });

    expect(await screen.findByText("Lumos")).toBeInTheDocument();
    expect(screen.queryByText("Incendio")).not.toBeInTheDocument();
  });
});

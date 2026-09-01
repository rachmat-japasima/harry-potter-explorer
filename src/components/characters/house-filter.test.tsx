import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HouseFilter } from "@/components/characters/house-filter";
import { renderWithProviders } from "@/test/render";

describe("HouseFilter", () => {
  it("renders All plus the given houses", () => {
    renderWithProviders(<HouseFilter houses={["Gryffindor", "Slytherin"]} />);

    expect(
      screen.getByRole("button", { name: "All", pressed: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /gryffindor/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /slytherin/i }),
    ).toBeInTheDocument();
  });

  it("selecting a house updates the URL state", async () => {
    const onUrlUpdate = vi.fn();
    renderWithProviders(<HouseFilter houses={["Gryffindor"]} />, {
      onUrlUpdate,
    });

    await userEvent.click(
      screen.getByRole("button", { name: /gryffindor/i }),
    );

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          queryString: expect.stringContaining("house=gryffindor"),
        }),
      );
    });
    expect(
      screen.getByRole("button", { name: /gryffindor/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("clearing the filter removes the house parameter", async () => {
    const onUrlUpdate = vi.fn();
    renderWithProviders(<HouseFilter houses={["Gryffindor"]} />, {
      searchParams: "?house=gryffindor",
      onUrlUpdate,
    });

    await userEvent.click(screen.getByRole("button", { name: "All" }));

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ queryString: "" }),
      );
    });
  });
});

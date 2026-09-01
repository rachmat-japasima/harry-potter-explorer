import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TypeFilter } from "@/components/characters/type-filter";
import { renderWithProviders } from "@/test/render";

describe("TypeFilter", () => {
  it("renders All/Students/Staff with All selected by default", () => {
    renderWithProviders(<TypeFilter />);

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Students" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Staff" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("selecting Students writes type=students and resets the page", async () => {
    const onUrlUpdate = vi.fn();
    renderWithProviders(<TypeFilter />, {
      searchParams: "?page=2",
      onUrlUpdate,
    });

    await userEvent.click(screen.getByRole("button", { name: "Students" }));

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          queryString: expect.stringContaining("type=students"),
        }),
      );
    });
  });

  it("selecting All clears the type parameter", async () => {
    const onUrlUpdate = vi.fn();
    renderWithProviders(<TypeFilter />, {
      searchParams: "?type=students",
      onUrlUpdate,
    });

    await userEvent.click(screen.getByRole("button", { name: "All" }));

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          queryString: expect.not.stringContaining("type="),
        }),
      );
    });
  });
});

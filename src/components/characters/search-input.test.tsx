import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SearchInput } from "@/components/characters/search-input";
import { renderWithProviders } from "@/test/render";

describe("SearchInput", () => {
  it("reflects an existing URL search value", () => {
    renderWithProviders(<SearchInput />, {
      searchParams: "?search=harry",
    });

    expect(screen.getByRole("searchbox")).toHaveValue("harry");
  });

  it("updates the URL when the user types (debounced)", async () => {
    const onUrlUpdate = vi.fn();
    // debounceMs=0 keeps the test under waitFor's default timeout.
    renderWithProviders(<SearchInput debounceMs={0} />, { onUrlUpdate });

    // fireEvent.change, not userEvent.type: React's controlled-input value
    // tracker resets the DOM value between delay-0 keystrokes, so per-char
    // typing emits fragmentary values. One change event carries the full value.
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "ron" },
    });

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          queryString: expect.stringContaining("search=ron"),
        }),
      );
    });
  });
});

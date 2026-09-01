import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "@/components/characters/pagination";
import { renderWithProviders } from "@/test/render";

describe("Pagination", () => {
  it("shows the page indicator and jump input when there are multiple pages", () => {
    renderWithProviders(<Pagination totalItems={25} pageSize={6} />);

    // Text is split across nested elements ("Page " + span + " of 5"), so
    // match the <p>'s full normalized textContent via a function matcher.
    expect(
      screen.getByText((_content, element) => element?.textContent === "Page 1 of 5"),
    ).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Jump to page" })).toHaveValue(
      1,
    );
  });

  it("navigates to a typed page via Go", async () => {
    const onUrlUpdate = vi.fn();
    renderWithProviders(<Pagination totalItems={25} pageSize={6} />, {
      onUrlUpdate,
    });

    fireEvent.change(screen.getByRole("spinbutton", { name: "Jump to page" }), {
      target: { value: "3" },
    });
    await userEvent.click(screen.getByRole("button", { name: "Go" }));

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: expect.stringContaining("page=3"),
      }),
    );
  });

  it("clamps an out-of-range page to the last page", async () => {
    const onUrlUpdate = vi.fn();
    renderWithProviders(<Pagination totalItems={25} pageSize={6} />, {
      onUrlUpdate,
    });

    fireEvent.change(screen.getByRole("spinbutton", { name: "Jump to page" }), {
      target: { value: "99" },
    });
    // fireEvent.submit bypasses constraint validation (max=5 would block a
    // click on Go in a real browser), exercising the code-side clamp. The
    // URL update lands in a later microtask, hence waitFor.
    fireEvent.submit(screen.getByRole("form", { name: "Jump to page" }));

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          queryString: expect.stringContaining("page=5"),
        }),
      );
    });
  });

  it("renders nothing when everything fits on one page", () => {
    const { container } = renderWithProviders(
      <Pagination totalItems={6} pageSize={6} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

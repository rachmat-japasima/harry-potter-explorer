import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import type { UrlUpdateEvent } from "nuqs/adapters/testing";
import type { ReactElement } from "react";

interface RenderOptions {
  /** Initial URL search params, e.g. "?search=harry&house=gryffindor". */
  searchParams?: string;
  /** Spy target for asserting URL updates. */
  onUrlUpdate?: (event: UrlUpdateEvent) => void;
  queryClient?: QueryClient;
}

/** Renders a component under QueryClientProvider + the nuqs testing adapter. */
export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const queryClient =
    options.queryClient ??
    new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <NuqsTestingAdapter
        searchParams={options.searchParams}
        onUrlUpdate={options.onUrlUpdate}
      >
        {ui}
      </NuqsTestingAdapter>
    </QueryClientProvider>,
  );

  return { ...utils, queryClient };
}

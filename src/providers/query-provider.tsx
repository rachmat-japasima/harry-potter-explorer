"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";

import { ThemeProvider } from "@/providers/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // The dataset is immutable, and build-time hydrated data carries
            // a build timestamp as dataUpdatedAt — any finite staleTime
            // makes it instantly stale and refetches on mount (the duplicate
            // initial request hydration exists to avoid). Manual refetch
            // (Try again) and error retries still work.
            staleTime: Infinity,
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}

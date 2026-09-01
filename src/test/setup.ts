import "@testing-library/jest-dom/vitest";
import { createElement, type HTMLAttributes } from "react";
import { vi } from "vitest";

// next/image's optimizer is irrelevant in jsdom — render a plain <img>.
vi.mock("next/image", () => ({
  default: (
    props: HTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      sizes?: string;
      priority?: boolean;
    },
  ) => {
    const imgProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) => !["fill", "sizes", "priority"].includes(key),
      ),
    );
    return createElement("img", imgProps as HTMLAttributes<HTMLImageElement>);
  },
}));

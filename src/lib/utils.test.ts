import { describe, expect, it } from "vitest";
import { paginate } from "./utils";

const items = [1, 2, 3, 4, 5];

describe("paginate", () => {
  it("slices a 1-based page", () => {
    expect(paginate(items, 1, 2)).toEqual([1, 2]);
    expect(paginate(items, 2, 2)).toEqual([3, 4]);
    expect(paginate(items, 3, 2)).toEqual([5]);
  });

  it("returns [] past the end", () => {
    expect(paginate(items, 99, 2)).toEqual([]);
  });

  it("clamps pages below 1", () => {
    expect(paginate(items, 0, 2)).toEqual([1, 2]);
  });
});

import { describe, expect, it } from "vitest";
import { isUnfiltered, newsHref, parseNewsFilters } from "./filters";

describe("news filters", () => {
  it("reads category, search and page, dropping unknown categories", () => {
    expect(parseNewsFilters({ category: "sports", q: "final", page: "2" })).toEqual({
      category: "sports",
      q: "final",
      page: 2,
    });
    expect(parseNewsFilters({ category: "gossip" }).category).toBeUndefined();
  });

  it("knows when to show top stories", () => {
    expect(isUnfiltered(parseNewsFilters({}))).toBe(true);
    expect(isUnfiltered(parseNewsFilters({ page: "2" }))).toBe(false);
    expect(isUnfiltered(parseNewsFilters({ q: "gcse" }))).toBe(false);
  });

  it("builds news URLs", () => {
    expect(newsHref({ category: "arts", page: 1 })).toBe("/news?category=arts");
  });
});

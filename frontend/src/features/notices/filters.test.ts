import { describe, expect, it } from "vitest";
import { noticesHref, parseNoticeFilters } from "./filters";

describe("notice filters", () => {
  it("reads category, search and page from the URL", () => {
    expect(parseNoticeFilters({ category: "closures", q: "snow", page: "2" })).toEqual({
      category: "closures",
      q: "snow",
      page: 2,
    });
  });

  it("drops invalid values instead of failing", () => {
    expect(parseNoticeFilters({ category: "gossip", page: "-3" })).toEqual({
      category: undefined,
      q: undefined,
      page: 1,
    });
    // Repeated params (?category=a&category=b) arrive as arrays: the first one counts.
    expect(parseNoticeFilters({ category: ["exams", "health"] }).category).toBe("exams");
  });

  it("builds notice board URLs, leaving out defaults", () => {
    expect(noticesHref({ category: "exams", page: 1 })).toBe("/notices?category=exams");
    expect(noticesHref({ q: "term dates", page: 2 })).toBe("/notices?q=term+dates&page=2");
    expect(noticesHref({})).toBe("/notices");
  });
});

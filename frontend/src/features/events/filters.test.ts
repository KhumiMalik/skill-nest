import { describe, expect, it } from "vitest";
import { eventsHref, parseEventFilters } from "./filters";

describe("event filters", () => {
  it("reads month, category, view and page from the URL", () => {
    expect(parseEventFilters({ month: "2026-12", category: "arts", view: "calendar", page: "2" })).toEqual({
      month: "2026-12",
      category: "arts",
      view: "calendar",
      page: 2,
    });
  });

  it("defaults to the list view and drops invalid values", () => {
    expect(parseEventFilters({ month: "2026-13", category: "music", view: "grid" })).toEqual({
      month: undefined,
      category: undefined,
      view: "list",
      page: 1,
    });
  });

  it("leaves the default view out of URLs", () => {
    expect(eventsHref({ view: "list", category: "sports" })).toBe("/events?category=sports");
    expect(eventsHref({ view: "calendar", month: "2027-01" })).toBe("/events?month=2027-01&view=calendar");
  });
});

import { describe, expect, it } from "vitest";
import { facultyHref, parseFacultyFilters } from "./filters";

describe("faculty filters", () => {
  it("reads filters from search params", () => {
    expect(parseFacultyFilters({ department: "science", q: " hart ", page: "2" })).toEqual({
      department: "science",
      q: "hart",
      page: 2,
    });
  });

  it("drops invalid values instead of failing", () => {
    expect(parseFacultyFilters({ department: "Not A Slug!", page: "-1", q: "" })).toEqual({
      department: undefined,
      q: undefined,
      page: 1,
    });
  });

  it("builds canonical directory URLs", () => {
    expect(facultyHref({})).toBe("/faculty");
    expect(facultyHref({ department: "science", page: 1 })).toBe("/faculty?department=science");
    expect(facultyHref({ q: "hart", page: 2 })).toBe("/faculty?q=hart&page=2");
  });
});

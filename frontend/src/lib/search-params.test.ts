import { describe, expect, it } from "vitest";
import { z } from "zod";
import { pageParam, searchParam, toQueryString } from "./search-params";

describe("searchParam", () => {
  const schema = z.object({ q: searchParam(z.string().max(5)) });

  it("takes the first value and trims it", () => {
    expect(schema.parse({ q: ["  abc ", "def"] })).toEqual({ q: "abc" });
  });

  it("treats blank and invalid values as missing instead of failing", () => {
    expect(schema.parse({ q: "   " })).toEqual({ q: undefined });
    expect(schema.parse({ q: "much too long" })).toEqual({ q: undefined });
    expect(schema.parse({})).toEqual({ q: undefined });
  });
});

describe("pageParam", () => {
  it("defaults to page 1 for missing or invalid values", () => {
    expect(pageParam.parse(undefined)).toBe(1);
    expect(pageParam.parse("abc")).toBe(1);
    expect(pageParam.parse("0")).toBe(1);
    expect(pageParam.parse("3")).toBe(3);
  });
});

describe("toQueryString", () => {
  it("skips empty values and page 1", () => {
    expect(toQueryString({ department: "science", q: "", page: 1 })).toBe("?department=science");
    expect(toQueryString({ q: "Dr Hart", page: 2 })).toBe("?q=Dr+Hart&page=2");
    expect(toQueryString({ q: undefined })).toBe("");
  });
});

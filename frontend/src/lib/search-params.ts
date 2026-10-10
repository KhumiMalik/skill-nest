import { z } from "zod";

// Helpers for list filters that live in the URL (?department=science&q=smith&page=2).
// Pages read them on the server, so filtered views work without JavaScript and can be shared as links.

/** What Next.js passes to a page as `await props.searchParams`. */
export type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Wraps a schema so it reads one search param leniently: it takes the first value
 * (`?q=a&q=b` → "a"), treats blank values as missing, and turns invalid values into
 * `undefined` instead of failing. A hand-edited URL should show unfiltered results, not an error.
 */
export function searchParam<T extends z.ZodType>(schema: T) {
  return z
    .preprocess((value) => {
      const first = Array.isArray(value) ? value[0] : value;
      return typeof first === "string" && first.trim() !== "" ? first.trim() : undefined;
    }, schema.optional())
    .catch(undefined);
}

/** A 1-based page number from the URL; anything invalid means page 1. */
export const pageParam = searchParam(z.coerce.number().int().min(1).max(10_000)).transform((page) => page ?? 1);

/** A month in the URL, "2026-10". */
export const monthParam = searchParam(z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/));

/** A search box value from the URL, at most 100 characters. */
export const queryParam = searchParam(z.string().max(100));

/** "" or "?category=sports&page=2". The precise type lets `/news${toQueryString(...)}` type-check as a route. */
export type QueryString = "" | `?${string}`;

/**
 * Builds "?department=science&q=smith" from filter values, skipping empty ones and page 1
 * (so the first page has one canonical URL). Returns "" when no filters are set.
 */
export function toQueryString(params: Record<string, string | number | undefined>): QueryString {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    if (key === "page" && Number(value) === 1) continue;
    query.set(key, String(value));
  }
  const result = query.toString();
  return result ? `?${result}` : "";
}

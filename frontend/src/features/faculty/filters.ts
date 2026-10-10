import type { Route } from "next";
import { z } from "zod";
import { slugSchema } from "@/lib/api/schemas";
import { pageParam, type SearchParams, searchParam, toQueryString } from "@/lib/search-params";

/**
 * Staff directory filters as they appear in the URL: /faculty?department=science&q=hart&page=2.
 * Invalid values are dropped rather than causing an error.
 */
const facultyFiltersSchema = z.object({
  department: searchParam(slugSchema),
  q: searchParam(z.string().max(100)),
  page: pageParam,
});

export type FacultyFilters = z.infer<typeof facultyFiltersSchema>;

export function parseFacultyFilters(searchParams: SearchParams): FacultyFilters {
  return facultyFiltersSchema.parse(searchParams);
}

/** The directory URL for a set of filters. */
export function facultyHref(filters: Partial<FacultyFilters>): Route {
  return `/faculty${toQueryString({ department: filters.department, q: filters.q, page: filters.page })}`;
}

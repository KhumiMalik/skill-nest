import type { Route } from "next";
import { z } from "zod";
import { pageParam, queryParam, type SearchParams, searchParam, toQueryString } from "@/lib/search-params";
import { newsCategorySchema } from "./schemas";

/** News list filters as they appear in the URL: /news?category=sports&q=final&page=2. */
const newsFiltersSchema = z.object({
  category: searchParam(newsCategorySchema),
  q: queryParam,
  page: pageParam,
});

export type NewsFilters = z.infer<typeof newsFiltersSchema>;

export function parseNewsFilters(searchParams: SearchParams): NewsFilters {
  return newsFiltersSchema.parse(searchParams);
}

export function newsHref(filters: Partial<NewsFilters>): Route {
  return `/news${toQueryString({ category: filters.category, q: filters.q, page: filters.page })}`;
}

/** True on the plain first page, where "Top stories" is shown. */
export function isUnfiltered(filters: NewsFilters): boolean {
  return !filters.category && !filters.q && filters.page === 1;
}

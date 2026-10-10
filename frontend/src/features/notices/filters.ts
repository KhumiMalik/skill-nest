import type { Route } from "next";
import { z } from "zod";
import { pageParam, queryParam, type SearchParams, searchParam, toQueryString } from "@/lib/search-params";
import { noticeCategorySchema } from "./schemas";

/** Notice board filters as they appear in the URL: /notices?category=closures&q=snow&page=2. */
const noticeFiltersSchema = z.object({
  category: searchParam(noticeCategorySchema),
  q: queryParam,
  page: pageParam,
});

export type NoticeFilters = z.infer<typeof noticeFiltersSchema>;

export function parseNoticeFilters(searchParams: SearchParams): NoticeFilters {
  return noticeFiltersSchema.parse(searchParams);
}

export function noticesHref(filters: Partial<NoticeFilters>): Route {
  return `/notices${toQueryString({ category: filters.category, q: filters.q, page: filters.page })}`;
}

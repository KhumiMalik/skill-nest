import type { Route } from "next";
import { z } from "zod";
import { monthParam, pageParam, type SearchParams, searchParam, toQueryString } from "@/lib/search-params";
import { eventCategorySchema } from "./schemas";

export const EVENT_VIEWS = ["list", "calendar"] as const;

/**
 * Events filters as they appear in the URL: /events?month=2026-11&category=arts&view=calendar.
 * Without `month`, the list shows upcoming events and the calendar shows the current month.
 */
const eventFiltersSchema = z.object({
  month: monthParam,
  category: searchParam(eventCategorySchema),
  view: searchParam(z.enum(EVENT_VIEWS)).transform((view) => view ?? "list"),
  page: pageParam,
});

export type EventFilters = z.infer<typeof eventFiltersSchema>;

export function parseEventFilters(searchParams: SearchParams): EventFilters {
  return eventFiltersSchema.parse(searchParams);
}

/** The events URL for a set of filters. The default list view is left out of the URL. */
export function eventsHref(filters: Partial<EventFilters>): Route {
  return `/events${toQueryString({
    month: filters.month,
    category: filters.category,
    view: filters.view === "calendar" ? "calendar" : undefined,
    page: filters.page,
  })}`;
}

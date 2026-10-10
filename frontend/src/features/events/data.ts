import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, isNotFound, mockApi, type Paginated, paginatedSchema, slugSchema } from "@/lib/api";
import { dayKey } from "@/lib/dates";
import { eventSchema, eventSummarySchema } from "./schemas";
import type { EventCategory, EventListQuery, EventSummary, SchoolEvent } from "./types";

/** Events per page in the list view. */
export const EVENTS_PAGE_SIZE = 10;

/** Events matching the filters, soonest first. Each filter combination is its own cache entry. */
export async function getEvents(query: Partial<EventListQuery> = {}): Promise<Paginated<EventSummary>> {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  return apiRequest({
    method: "GET",
    path: "/events",
    query,
    schema: paginatedSchema(eventSummarySchema),
    mock: () => mockApi.events.list(query),
  });
}

/**
 * The next few events, soonest first (optionally in one category).
 * "Upcoming" depends on today's date, so the result is cached for hours rather than days:
 * an event drops off the list at most an hour after it ends. Reading the clock is allowed
 * here because it happens inside a cache scope (see docs/architecture.md, "Rendering and caching").
 */
export async function getUpcomingEvents(limit = 4, category?: EventCategory): Promise<EventSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  const { data } = await getEvents({ from: dayKey(new Date()), category, pageSize: limit });
  return data;
}

/** The next featured event, for the sidebar. */
export async function getFeaturedEvent(): Promise<EventSummary | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  const { data } = await getEvents({ from: dayKey(new Date()), featured: true, pageSize: 1 });
  return data[0] ?? null;
}

/**
 * Whether a moment (an event's end, a booking deadline) is in the past. It depends on the current
 * time, so the answer is cached for an hour: reading the clock is allowed inside a cache scope, and
 * pages using it refresh at least hourly. Server actions re-check deadlines exactly.
 */
export async function hasPassed(time: string): Promise<boolean> {
  "use cache";
  cacheLife("hours");
  return new Date(time).getTime() <= Date.now();
}

/** An event, or `null` if the slug doesn't exist (the page then shows a 404). */
export async function getEvent(slug: string): Promise<SchoolEvent | null> {
  if (!slugSchema.safeParse(slug).success) return null;
  return fetchEvent(slug);
}

async function fetchEvent(slug: string): Promise<SchoolEvent | null> {
  "use cache";
  cacheLife("days");
  cacheTag("events", `event:${slug}`);
  try {
    return await apiRequest({
      method: "GET",
      path: `/events/${encodeURIComponent(slug)}`,
      schema: eventSchema,
      mock: () => mockApi.events.get(slug),
    });
  } catch (error) {
    // Return null instead of throwing: errors don't keep their class when they cross a cache boundary.
    if (isNotFound(error)) return null;
    throw error;
  }
}

import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, mockApi, paginatedSchema } from "@/lib/api";
import { dayKey } from "@/lib/dates";
import { eventSummarySchema } from "./schemas";
import type { EventSummary } from "./types";

/**
 * The next few events, soonest first.
 * "Upcoming" depends on today's date, so the result is cached for hours rather than days:
 * an event drops off the list at most an hour after it ends. Reading the clock is allowed
 * here because it happens inside a cache scope (see docs/architecture.md, "Rendering and caching").
 */
export async function getUpcomingEvents(limit = 4): Promise<EventSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  const query = { from: dayKey(new Date()), pageSize: limit };
  const result = await apiRequest({
    method: "GET",
    path: "/events",
    query,
    schema: paginatedSchema(eventSummarySchema),
    mock: () => mockApi.events.list(query),
  });
  return result.data;
}

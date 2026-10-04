import type { EventListQuery } from "@/features/events";
import { paginate } from "@/lib/api/pagination";
import type { PaginationQuery } from "@/lib/api/schemas";
import { dayKey } from "@/lib/dates";
import { events } from "./data/events";
import { parsePagination } from "./utils";

/**
 * Replaces `GET /api/v1/events?from=&page=&pageSize=` (soonest first).
 * `from` keeps events that end on or after that day, so an event in progress still counts as upcoming.
 */
export function listEvents(query: EventListQuery & Partial<PaginationQuery>) {
  const matches = events
    .filter((event) => query.from === undefined || dayKey(event.endsAt) >= query.from)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return paginate(matches, parsePagination(query));
}

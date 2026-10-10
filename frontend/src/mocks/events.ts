import type { EventListQuery } from "@/features/events";
import { eventRegistrationSchema } from "@/features/events/schemas";
import { ApiError, validationError } from "@/lib/api/errors";
import { paginate } from "@/lib/api/pagination";
import { dayKey } from "@/lib/dates";
import { events } from "./data/events";
import { mockOutbox } from "./forms";
import { parsePagination, pick } from "./utils";

const SUMMARY_KEYS = [
  "slug",
  "title",
  "summary",
  "category",
  "startsAt",
  "endsAt",
  "location",
  "image",
  "featured",
] as const;

/**
 * Replaces `GET /api/v1/events?from=&to=&category=&featured=&page=&pageSize=` (soonest first).
 * An event matches a date range when it overlaps it, so a multi-day event shows up on every day it runs.
 */
export function listEvents(query: Partial<EventListQuery>) {
  const matches = events
    .filter(
      (event) =>
        (query.from === undefined || dayKey(event.endsAt) >= query.from) &&
        (query.to === undefined || dayKey(event.startsAt) <= query.to) &&
        (query.category === undefined || event.category === query.category) &&
        (query.featured === undefined || event.featured === query.featured),
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return paginate(
    matches.map((event) => pick(event, SUMMARY_KEYS)),
    parsePagination(query),
  );
}

/** Replaces `GET /api/v1/events/{slug}` */
export function getEvent(slug: string) {
  const event = events.find((e) => e.slug === slug);
  if (!event) throw new ApiError(404, { message: "Event not found." });
  return event;
}

/** Places already booked, by event slug (in memory). One event starts nearly full to show the "places left" error. */
const bookedPlaces = new Map<string, number>([["alumni-mentoring-breakfast-2027", 38]]);

/**
 * Replaces `POST /api/v1/events/{slug}/registrations`.
 * 404 unknown event; 422 when booking isn't open or there aren't enough places; 201 otherwise.
 */
export function registerForEvent(slug: string, body: unknown, now: Date = new Date()) {
  const event = getEvent(slug);
  const parsed = eventRegistrationSchema.safeParse(body);
  if (!parsed.success) throw validationError(parsed.error);

  const { registration } = event;
  if (!registration || new Date(registration.deadline) <= now) {
    throw new ApiError(422, {
      message: "Booking for this event is closed.",
      errors: { _form: ["Booking for this event is closed."] },
    });
  }

  const booked = bookedPlaces.get(slug) ?? 0;
  if (registration.capacity !== undefined && booked + parsed.data.places > registration.capacity) {
    const left = registration.capacity - booked;
    throw new ApiError(422, {
      message: "Not enough places left.",
      errors: {
        places: [
          left > 0 ? `Only ${left} ${left === 1 ? "place is" : "places are"} left.` : "This event is fully booked.",
        ],
      },
    });
  }

  bookedPlaces.set(slug, booked + parsed.data.places);
  mockOutbox.push({ endpoint: `POST /events/${slug}/registrations`, body: parsed.data, receivedAt: now.toISOString() });
  return { id: crypto.randomUUID(), message: "Booking confirmed." };
}

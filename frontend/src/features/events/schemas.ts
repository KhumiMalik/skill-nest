import { z } from "zod";
import {
  contentBlockSchema,
  dateTimeSchema,
  emailAddressSchema,
  imageSchema,
  messageSchema,
  paginationQuerySchema,
  personNameSchema,
  phoneNumberSchema,
  slugSchema,
} from "@/lib/api/schemas";

export const EVENT_CATEGORIES = ["academic", "sports", "arts", "community", "alumni"] as const;
export const eventCategorySchema = z.enum(EVENT_CATEGORIES);

export const EVENT_CATEGORY_LABELS: Record<z.infer<typeof eventCategorySchema>, string> = {
  academic: "Academic",
  sports: "Sports",
  arts: "Arts",
  community: "Community",
  alumni: "Alumni",
};

/** Returned by GET /events (list), soonest first. */
export const eventSummarySchema = z.object({
  slug: slugSchema,
  title: z.string(),
  summary: z.string(),
  category: eventCategorySchema,
  startsAt: dateTimeSchema,
  /** May be on a later day than startsAt (multi-day events). */
  endsAt: dateTimeSchema,
  location: z.string(),
  image: imageSchema,
  /** Highlighted in the events sidebar. */
  featured: z.boolean(),
});

/** Returned by GET /events/{slug}. */
export const eventSchema = eventSummarySchema.extend({
  description: z.array(contentBlockSchema).min(1),
  /** Timetable for the day; empty when there is none. Times are "HH:MM" in the school's time zone. */
  schedule: z.array(z.object({ time: z.string().regex(/^\d{2}:\d{2}$/), title: z.string(), text: z.string() })),
  /** Postal address, only for venues away from the school site (e.g. "Church Street, Greenfield GF1 4SM"). */
  address: z.string().optional(),
  organizer: z.object({ name: z.string(), role: z.string(), email: z.email() }),
  /** "Free", "£8 adults, £4 pupils"... */
  cost: z.string(),
  /** Null when no booking is needed; otherwise the event page shows a booking form. */
  registration: z
    .object({
      deadline: dateTimeSchema,
      /** Places available in total; omitted when unlimited. */
      capacity: z.number().int().positive().optional(),
    })
    .nullable(),
});

/**
 * Query params of GET /events. `from` and `to` are days ("2026-10-04") in the school's time zone:
 * an event matches when it overlaps the range (ends on or after `from`, starts on or before `to`).
 */
export const eventListQuerySchema = paginationQuerySchema.extend({
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
  category: eventCategorySchema.optional(),
  featured: z.boolean().optional(),
});

/** Most places one booking can take (the API also checks the places left). */
export const MAX_PLACES_PER_BOOKING = 10;

/** Body of POST /events/{slug}/registrations. */
export const eventRegistrationSchema = z.object({
  name: personNameSchema,
  email: emailAddressSchema,
  phone: phoneNumberSchema.optional(),
  places: z
    .number({ error: "Choose how many places you need." })
    .int()
    .min(1, "Choose how many places you need.")
    .max(MAX_PLACES_PER_BOOKING, `You can book up to ${MAX_PLACES_PER_BOOKING} places at once.`),
  /** Dietary or access needs, names of guests... */
  notes: messageSchema(500).optional(),
});

import { z } from "zod";
import { dateTimeSchema, imageSchema, slugSchema } from "@/lib/api/schemas";

export const EVENT_CATEGORIES = ["academic", "sports", "arts", "community"] as const;
export const eventCategorySchema = z.enum(EVENT_CATEGORIES);

export const EVENT_CATEGORY_LABELS: Record<z.infer<typeof eventCategorySchema>, string> = {
  academic: "Academic",
  sports: "Sports",
  arts: "Arts",
  community: "Community",
};

/** Returned by GET /events (list), soonest first. The detail fields are added in Phase 4. */
export const eventSummarySchema = z.object({
  slug: slugSchema,
  title: z.string(),
  summary: z.string(),
  category: eventCategorySchema,
  startsAt: dateTimeSchema,
  endsAt: dateTimeSchema,
  location: z.string(),
  image: imageSchema,
});

/** Query params of GET /events. `from` is a day ("2026-10-04") in the school's time zone. */
export const eventListQuerySchema = z.object({
  from: z.iso.date().optional(),
});

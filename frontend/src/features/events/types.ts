import type { z } from "zod";
import type {
  eventCategorySchema,
  eventListQuerySchema,
  eventRegistrationSchema,
  eventSchema,
  eventSummarySchema,
} from "./schemas";

export type EventCategory = z.infer<typeof eventCategorySchema>;
export type EventSummary = z.infer<typeof eventSummarySchema>;
export type SchoolEvent = z.infer<typeof eventSchema>;
export type EventListQuery = z.infer<typeof eventListQuerySchema>;
export type EventRegistration = z.infer<typeof eventRegistrationSchema>;

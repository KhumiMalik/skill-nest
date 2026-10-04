import type { z } from "zod";
import type { eventCategorySchema, eventListQuerySchema, eventSummarySchema } from "./schemas";

export type EventCategory = z.infer<typeof eventCategorySchema>;
export type EventSummary = z.infer<typeof eventSummarySchema>;
export type EventListQuery = z.infer<typeof eventListQuerySchema>;

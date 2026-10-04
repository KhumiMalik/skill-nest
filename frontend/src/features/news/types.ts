import type { z } from "zod";
import type { newsCategorySchema, newsSummarySchema } from "./schemas";

export type NewsCategory = z.infer<typeof newsCategorySchema>;
export type NewsSummary = z.infer<typeof newsSummarySchema>;

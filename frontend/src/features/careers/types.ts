import type { z } from "zod";
import type { staffCategorySchema, vacancyListQuerySchema, vacancySchema, vacancySummarySchema } from "./schemas";

export type StaffCategory = z.infer<typeof staffCategorySchema>;
export type VacancySummary = z.infer<typeof vacancySummarySchema>;
export type Vacancy = z.infer<typeof vacancySchema>;
export type VacancyListQuery = z.infer<typeof vacancyListQuerySchema>;

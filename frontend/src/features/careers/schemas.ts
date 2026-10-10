import { z } from "zod";
import { contentBlockSchema, dateTimeSchema, fileSchema, paginationQuerySchema, slugSchema } from "@/lib/api/schemas";

export const STAFF_CATEGORIES = ["teaching", "support"] as const;
export const staffCategorySchema = z.enum(STAFF_CATEGORIES);
export const STAFF_CATEGORY_LABELS: Record<z.infer<typeof staffCategorySchema>, string> = {
  teaching: "Teaching",
  support: "Support staff",
};

export const CONTRACT_TYPES = ["permanent", "fixed-term"] as const;
export const CONTRACT_TYPE_LABELS: Record<(typeof CONTRACT_TYPES)[number], string> = {
  permanent: "Permanent",
  "fixed-term": "Fixed term",
};

export const WORKING_PATTERNS = ["full-time", "part-time"] as const;
export const WORKING_PATTERN_LABELS: Record<(typeof WORKING_PATTERNS)[number], string> = {
  "full-time": "Full time",
  "part-time": "Part time",
};

/** Returned by GET /careers/vacancies (list): open vacancies only, closing soonest first. */
export const vacancySummarySchema = z.object({
  slug: slugSchema,
  title: z.string(),
  category: staffCategorySchema,
  department: z.string(),
  contract: z.enum(CONTRACT_TYPES),
  pattern: z.enum(WORKING_PATTERNS),
  /** As advertised, e.g. "MPS/UPS + 5% Greenfield allowance" or "£24,500 - £26,800 per annum". */
  salary: z.string(),
  /** e.g. "January 2027" or "As soon as possible". */
  startDate: z.string(),
  /** When the vacancy was advertised. */
  postedAt: dateTimeSchema,
  closesAt: dateTimeSchema,
  summary: z.string(),
});

/** Returned by GET /careers/vacancies/{slug}. Closed vacancies are still returned (with their closing date). */
export const vacancySchema = vacancySummarySchema.extend({
  description: z.array(contentBlockSchema).min(1),
  responsibilities: z.array(z.string()),
  /** Person specification: what candidates need. */
  requirements: z.array(z.string()),
  /** Job description and application form; null when the pack isn't published yet. */
  applicationPack: fileSchema.nullable(),
  contact: z.object({ name: z.string(), role: z.string(), email: z.email() }),
});

/** Query params of GET /careers/vacancies. */
export const vacancyListQuerySchema = paginationQuerySchema.extend({ category: staffCategorySchema.optional() });

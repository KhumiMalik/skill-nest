import { z } from "zod";
import { contentBlockSchema, dateTimeSchema, paginationQuerySchema, slugSchema } from "@/lib/api/schemas";

/** Official announcements for families: term dates, closures, exams, health... */
export const NOTICE_CATEGORIES = ["general", "term-dates", "exams", "closures", "health", "admissions"] as const;
export const noticeCategorySchema = z.enum(NOTICE_CATEGORIES);

export const NOTICE_CATEGORY_LABELS: Record<z.infer<typeof noticeCategorySchema>, string> = {
  general: "General",
  "term-dates": "Term Dates",
  exams: "Examinations",
  closures: "Closures",
  health: "Health & Safety",
  admissions: "Admissions",
};

/** Returned by GET /notices (list): important notices first, then newest first. */
export const noticeSummarySchema = z.object({
  slug: slugSchema,
  title: z.string(),
  summary: z.string(),
  category: noticeCategorySchema,
  publishedAt: dateTimeSchema,
  /** Shown with an "Important" badge and listed before other notices. */
  important: z.boolean(),
  /** Who the notice is for, e.g. ["Parents", "Year 11"]. */
  audience: z.array(z.string()),
});

/** Returned by GET /notices/{slug}. */
export const noticeSchema = noticeSummarySchema.extend({
  body: z.array(contentBlockSchema).min(1),
  contact: z.object({ name: z.string(), email: z.email() }).optional(),
});

/** Query params of GET /notices. `q` matches title and summary. */
export const noticeListQuerySchema = paginationQuerySchema.extend({
  category: noticeCategorySchema.optional(),
  q: z.string().trim().max(100).optional(),
});

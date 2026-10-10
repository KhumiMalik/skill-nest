import { z } from "zod";
import { paginationQuerySchema, slugSchema } from "@/lib/api/schemas";

/** A topic grouping questions on the FAQ page, e.g. { slug: "admissions", name: "Admissions" }. */
export const faqCategorySchema = z.object({ slug: slugSchema, name: z.string() });

/** Returned by GET /faqs, in display order (by category, then as the editors ordered them). */
export const faqSchema = z.object({
  /** Stable id, also used as the question's anchor (/faq#school-day-times). */
  id: slugSchema,
  question: z.string(),
  /** Paragraphs of plain text. */
  answer: z.array(z.string().min(1)).min(1),
  category: faqCategorySchema,
});

/** Query params of GET /faqs. */
export const faqListQuerySchema = paginationQuerySchema.extend({ category: slugSchema.optional() });

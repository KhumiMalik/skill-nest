import type { z } from "zod";
import type { faqCategorySchema, faqListQuerySchema, faqSchema } from "./schemas";

export type FaqCategory = z.infer<typeof faqCategorySchema>;
export type Faq = z.infer<typeof faqSchema>;
export type FaqListQuery = z.infer<typeof faqListQuerySchema>;
export type FaqGroup = { category: FaqCategory; faqs: Faq[] };

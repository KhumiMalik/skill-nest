import type { FaqListQuery } from "@/features/faq";
import { paginate } from "@/lib/api/pagination";
import { faqs } from "./data/faqs";
import { parsePagination } from "./utils";

/** Replaces `GET /api/v1/faqs?category=&page=&pageSize=` (display order). */
export function listFaqs(query: Partial<FaqListQuery>) {
  const matches = faqs.filter((faq) => query.category === undefined || faq.category.slug === query.category);
  return paginate(matches, parsePagination(query));
}

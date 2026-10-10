import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, mockApi, paginatedSchema } from "@/lib/api";
import { faqSchema } from "./schemas";
import type { Faq } from "./types";

/** All questions, or one category's (e.g. "admissions" on the admissions page), in display order. */
export async function getFaqs(category?: string): Promise<Faq[]> {
  "use cache";
  cacheLife("days");
  cacheTag("faqs");
  const query = { category, pageSize: 50 };
  const { data } = await apiRequest({
    method: "GET",
    path: "/faqs",
    query,
    schema: paginatedSchema(faqSchema),
    mock: () => mockApi.faqs.list(query),
  });
  return data;
}

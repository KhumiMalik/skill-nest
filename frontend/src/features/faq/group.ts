import type { Faq, FaqGroup } from "./types";

/** Groups questions by category, keeping the API's order of categories and of questions. */
export function groupFaqs(faqs: Faq[]): FaqGroup[] {
  const groups = new Map<string, FaqGroup>();
  for (const faq of faqs) {
    const group = groups.get(faq.category.slug);
    if (group) group.faqs.push(faq);
    else groups.set(faq.category.slug, { category: faq.category, faqs: [faq] });
  }
  return [...groups.values()];
}

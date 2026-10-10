import type { JsonLd } from "@/lib/seo/json-ld";
import type { Faq } from "./types";

/** schema.org FAQPage: every question with its answer. */
export function faqPageJsonLd(faqs: Faq[]): JsonLd {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer.join("\n\n") },
    })),
  };
}

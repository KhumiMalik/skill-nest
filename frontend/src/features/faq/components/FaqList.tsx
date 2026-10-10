import { Icon } from "@/components/ui/Icon";
import type { Faq } from "../types";

/**
 * Questions as native `<details>` disclosures: keyboard and screen-reader support built in, and they
 * work without JavaScript. Each has an id, so /faq#question-id links to it (browsers open a
 * `<details>` when the link targets it).
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq-list">
      {faqs.map((faq) => (
        <details className="faq-item" id={faq.id} key={faq.id}>
          <summary>
            <span>{faq.question}</span>
            <Icon name="chevron-down" className="faq-chevron" />
          </summary>
          <div className="faq-answer">
            {faq.answer.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

import Link from "next/link";
import { groupFaqs } from "../group";
import type { Faq } from "../types";
import { FaqList } from "./FaqList";

/** The FAQ page: a topic index on the side and one section of questions per topic. */
export function FaqDirectory({ faqs }: { faqs: Faq[] }) {
  const groups = groupFaqs(faqs);

  return (
    <section className="section">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-3">
            <nav className="sidebar-box faq-topics" aria-labelledby="faq-topics-title">
              <h2 id="faq-topics-title">Topics</h2>
              <ul className="plain filter-list">
                {groups.map(({ category, faqs: questions }) => (
                  <li key={category.slug}>
                    <a href={`#${category.slug}`}>
                      {category.name} <span className="count">{questions.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-lg-9">
            {groups.map(({ category, faqs: questions }) => (
              <section className="faq-group" key={category.slug} aria-labelledby={category.slug}>
                <h2 id={category.slug}>{category.name}</h2>
                <FaqList faqs={questions} />
              </section>
            ))}
            <p className="faq-more">
              Can&apos;t find what you are looking for? <Link href="/contact">Contact the school office</Link> and
              we&apos;ll get back to you within one working day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

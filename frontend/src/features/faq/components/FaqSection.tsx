import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Faq } from "../types";
import { FaqList } from "./FaqList";

type FaqSectionProps = { title: string; subtitle?: string; faqs: Faq[]; className?: string };

/** A few questions on another page (e.g. admissions), with a link to the full FAQ. */
export function FaqSection({ title, subtitle, faqs, className = "section" }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className={className}>
      <div className="container">
        <SectionTitle title={title} subtitle={subtitle} />
        <div className="faq-narrow reveal">
          <FaqList faqs={faqs} />
          <p className="faq-more">
            More questions? <Link href="/faq">Read all frequently asked questions</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}

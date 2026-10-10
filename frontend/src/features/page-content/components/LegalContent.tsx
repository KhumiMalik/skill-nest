import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { formatDay } from "@/lib/dates";
import type { LegalPage } from "../types";

/** Body of the privacy policy and the terms of use. */
export function LegalContent({ page }: { page: LegalPage }) {
  return (
    <section className="section">
      <div className="container">
        <div className="legal-content">
          <p className="updated">
            Last updated: <time dateTime={page.updatedOn}>{formatDay(page.updatedOn)}</time>
          </p>
          <ContentBlocks blocks={page.body} />
        </div>
      </div>
    </section>
  );
}

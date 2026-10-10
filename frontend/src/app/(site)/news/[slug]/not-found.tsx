import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";

/** Shown when an article slug doesn't exist. Renders inside the site layout (header and footer). */
export default function NewsArticleNotFound() {
  return (
    <>
      <PageBanner title="Article not found" breadcrumbs={[{ label: "News", href: "/news" }, { label: "Not found" }]} />
      <section className="section error-404">
        <div className="container">
          <h2>We couldn&apos;t find that article</h2>
          <p>It may have been removed, or the address may be mistyped.</p>
          <Link href="/news" className="btn-main mt-3">
            See all news
          </Link>
        </div>
      </section>
    </>
  );
}

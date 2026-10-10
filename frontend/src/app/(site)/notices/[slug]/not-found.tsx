import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";

/** Shown when a notice slug doesn't exist. Renders inside the site layout (header and footer). */
export default function NoticeNotFound() {
  return (
    <>
      <PageBanner
        title="Notice not found"
        breadcrumbs={[{ label: "Notices", href: "/notices" }, { label: "Not found" }]}
      />
      <section className="section error-404">
        <div className="container">
          <h2>We couldn&apos;t find that notice</h2>
          <p>It may have expired and been removed.</p>
          <Link href="/notices" className="btn-main mt-3">
            See the notice board
          </Link>
        </div>
      </section>
    </>
  );
}

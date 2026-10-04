import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";

/** Shown when a program slug doesn't exist. Renders inside the site layout (header and footer). */
export default function ProgramNotFound() {
  return (
    <>
      <PageBanner
        title="Program not found"
        breadcrumbs={[{ label: "Programs", href: "/programs" }, { label: "Not found" }]}
      />
      <section className="section error-404">
        <div className="container">
          <h2>We couldn&apos;t find that program</h2>
          <p>It may have been renamed or is no longer offered.</p>
          <Link href="/programs" className="btn-main mt-3">
            See all programs
          </Link>
        </div>
      </section>
    </>
  );
}

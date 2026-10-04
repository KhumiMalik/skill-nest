import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";

/** Shown when a staff profile slug doesn't exist. Renders inside the site layout (header and footer). */
export default function FacultyMemberNotFound() {
  return (
    <>
      <PageBanner
        title="Staff member not found"
        breadcrumbs={[{ label: "Faculty & Staff", href: "/faculty" }, { label: "Not found" }]}
      />
      <section className="section error-404">
        <div className="container">
          <h2>We couldn&apos;t find that profile</h2>
          <p>The person may have left the school, or the address may be mistyped.</p>
          <Link href="/faculty" className="btn-main mt-3">
            Search the staff directory
          </Link>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";

/** Shown when an event slug doesn't exist. Renders inside the site layout (header and footer). */
export default function EventNotFound() {
  return (
    <>
      <PageBanner
        title="Event not found"
        breadcrumbs={[{ label: "Events", href: "/events" }, { label: "Not found" }]}
      />
      <section className="section error-404">
        <div className="container">
          <h2>We couldn&apos;t find that event</h2>
          <p>It may have been cancelled or moved to a new date.</p>
          <Link href="/events" className="btn-main mt-3">
            See all events
          </Link>
        </div>
      </section>
    </>
  );
}

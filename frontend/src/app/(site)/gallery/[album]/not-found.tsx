import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";

/** Shown when an album slug doesn't exist. Renders inside the site layout (header and footer). */
export default function AlbumNotFound() {
  return (
    <>
      <PageBanner
        title="Album not found"
        breadcrumbs={[{ label: "Gallery", href: "/gallery" }, { label: "Not found" }]}
      />
      <section className="section error-404">
        <div className="container">
          <h2>We couldn&apos;t find that album</h2>
          <p>It may have been renamed or removed.</p>
          <Link href="/gallery" className="btn-main mt-3">
            See all albums
          </Link>
        </div>
      </section>
    </>
  );
}

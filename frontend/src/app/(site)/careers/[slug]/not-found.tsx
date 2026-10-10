import Link from "next/link";
import { PageBanner } from "@/components/layout/PageBanner";

/** Shown when a vacancy slug doesn't exist. Renders inside the site layout (header and footer). */
export default function VacancyNotFound() {
  return (
    <>
      <PageBanner
        title="Vacancy not found"
        breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: "Not found" }]}
      />
      <section className="section error-404">
        <div className="container">
          <h2>We couldn&apos;t find that vacancy</h2>
          <p>It may have been filled and removed from the website.</p>
          <Link href="/careers" className="btn-main mt-3">
            See current vacancies
          </Link>
        </div>
      </section>
    </>
  );
}

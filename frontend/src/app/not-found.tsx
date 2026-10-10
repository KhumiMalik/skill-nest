import type { NavLink } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageBanner } from "@/components/layout/PageBanner";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const SUGGESTIONS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/admissions", label: "Admissions" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact us" },
];

/** Global 404 for unmatched URLs and for `notFound()` calls without a closer not-found file. */
export default function NotFound() {
  return (
    <SiteShell>
      <PageBanner title="Page not found" breadcrumbs={[{ label: "404" }]} />
      <section className="section error-404">
        <div className="container">
          <p className="error-code" aria-hidden="true">
            404
          </p>
          <h2>We couldn&apos;t find that page</h2>
          <p>The page may have moved, or the address may be mistyped.</p>
          <h3 className="h5 mt-4">You might want to visit:</h3>
          <ul className="d-flex flex-wrap justify-content-center gap-2 mt-3 list-unstyled">
            {SUGGESTIONS.map((link, index) => (
              <li key={link.href}>
                <Link href={link.href} className={index === 0 ? "btn-main" : "btn-outline-main"}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}

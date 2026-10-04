"use client"; // Error boundaries must be Client Components.

import Link from "next/link";
import { useEffect } from "react";

/** Shown when rendering a public page throws (e.g. the API is down). The header and footer stay. */
export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // Replace with a real error reporter (e.g. Sentry) when one is chosen.
    console.error(error);
  }, [error]);

  return (
    <section className="section error-404" role="alert">
      <div className="container">
        <h1>Something went wrong</h1>
        <p>We couldn&apos;t load this page. Please try again in a moment.</p>
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
          <button type="button" className="btn-main" onClick={() => retry()}>
            Try again
          </button>
          <Link href="/" className="btn-outline-main">
            Go to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}

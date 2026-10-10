import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

type LinkIndexProps = {
  title: string;
  note: string;
  /** Site paths built from data, e.g. `/news/${slug}`. */
  items: { href: string; title: string; meta?: string }[];
};

/**
 * A plain list of links for visitors without JavaScript, who can't see streamed (filtered) lists.
 * Rendered inside <noscript> by ResultsSkeleton.
 */
export function LinkIndex({ title, note, items }: LinkIndexProps) {
  return (
    <div className="sidebar-box">
      <h2>{title}</h2>
      <p>{note}</p>
      <ul className="plain">
        {items.map((item) => (
          <li key={item.href}>
            {/* Typed routes can only check slugs written inline in a <Link>; these come from data. */}
            <Link href={item.href as Route}>{item.title}</Link>
            {item.meta && <span>{item.meta}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

type ResultsSkeletonProps = {
  /** "cards": a grid of cards; "rows": a vertical list of wide rows. */
  variant: "cards" | "rows";
  count?: number;
  label: string;
  /**
   * Shown instead of the skeleton when JavaScript is off. Streamed Suspense content needs a
   * small inline script to appear, so without JavaScript it would never replace the skeleton.
   */
  noScriptFallback?: ReactNode;
};

/** Placeholder shown while a filtered list streams in. */
export function ResultsSkeleton({ variant, count = 6, label, noScriptFallback }: ResultsSkeletonProps) {
  return (
    <>
      {noScriptFallback && (
        <noscript>
          <style>{".results-skeleton { display: none; }"}</style>
          {noScriptFallback}
        </noscript>
      )}
      <div className="results-skeleton">
        <p className="visually-hidden" role="status">
          {label}
        </p>
        <div aria-hidden="true">
          <div className="skeleton skeleton-line w-25 mb-4" />
          {variant === "cards" ? (
            <div className="row g-4">
              {Array.from({ length: count }, (_, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div className="skeleton skeleton-card" />
                </div>
              ))}
            </div>
          ) : (
            Array.from({ length: count }, (_, index) => <div key={index} className="skeleton skeleton-row" />)
          )}
        </div>
      </div>
    </>
  );
}

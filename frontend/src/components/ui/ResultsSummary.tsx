import type { PaginationMeta } from "@/lib/api/schemas";

type ResultsSummaryProps = {
  meta: PaginationMeta;
  /** Shown in the count: "articles", "notices"... */
  noun: string;
  /** Text describing the active filters, e.g. ` in Sports matching "final"`. */
  filtersText?: string;
  emptyText: string;
};

/**
 * "Showing 1-9 of 16 articles in Sports". A polite live region: when filters change through
 * client-side navigation, screen readers announce the new count.
 */
export function ResultsSummary({ meta, noun, filtersText = "", emptyText }: ResultsSummaryProps) {
  const first = (meta.page - 1) * meta.pageSize + 1;
  const last = Math.min(meta.page * meta.pageSize, meta.total);
  return (
    <p className="results-summary" role="status">
      {meta.total === 0 || first > meta.total ? emptyText : `Showing ${first}-${last} of ${meta.total} ${noun}`}
      {filtersText}
    </p>
  );
}

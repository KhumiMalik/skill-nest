import Link from "next/link";
import { Icon } from "./Icon";

type PageItem = number | "gap";

/**
 * The page numbers to show: always the first and last page, plus the current page and its
 * neighbours, with "gap" where pages are skipped. 1 2 3 … 9 instead of 1 2 3 4 5 6 7 8 9.
 */
export function getPageItems(current: number, total: number): PageItem[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  const items: PageItem[] = [];
  for (const page of sorted) {
    const previous = items.at(-1);
    if (typeof previous === "number" && page - previous === 2) items.push(previous + 1);
    else if (typeof previous === "number" && page - previous > 2) items.push("gap");
    items.push(page);
  }
  return items;
}

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Builds the link for a page, keeping the current filters. */
  hrefForPage: (page: number) => string;
};

/** Page links for server-rendered lists. Every page is a real URL, so it works without JavaScript. */
export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination">
      <ul className="pager">
        {page > 1 && (
          <li>
            <Link href={hrefForPage(page - 1)} aria-label="Previous page">
              <Icon name="chevron-left" />
            </Link>
          </li>
        )}
        {getPageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className="pager-gap" aria-hidden="true">
              &hellip;
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefForPage(item)}
                className={item === page ? "active" : undefined}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
        {page < totalPages && (
          <li>
            <Link href={hrefForPage(page + 1)} aria-label="Next page">
              <Icon name="chevron-right" />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

import Form from "next/form";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import { ResultsSummary } from "@/components/ui/ResultsSummary";
import type { Paginated } from "@/lib/api/schemas";
import { dateParts, formatDate, isoDateTime } from "@/lib/dates";
import { type NoticeFilters, noticesHref } from "../filters";
import { NOTICE_CATEGORIES, NOTICE_CATEGORY_LABELS } from "../schemas";
import type { NoticeSummary } from "../types";

export function NoticeRow({ notice }: { notice: NoticeSummary }) {
  const { day, month } = dateParts(notice.publishedAt);
  return (
    <article className={notice.important ? "notice-row important" : "notice-row"}>
      <time className="date-block" dateTime={isoDateTime(notice.publishedAt)}>
        <span className="day">{day}</span> <span className="month">{month}</span>
        <span className="visually-hidden"> {formatDate(notice.publishedAt)}</span>
      </time>
      <div>
        <div className="notice-badges">
          {notice.important && (
            <span className="notice-badge important">
              <Icon name="exclamation-circle" /> Important
            </span>
          )}
          <span className="notice-badge">{NOTICE_CATEGORY_LABELS[notice.category]}</span>
        </div>
        <h3>
          <Link href={`/notices/${notice.slug}`}>{notice.title}</Link>
        </h3>
        <p className="mb-1">{notice.summary}</p>
        {notice.audience.length > 0 && <p className="notice-audience">For: {notice.audience.join(", ")}</p>}
      </div>
    </article>
  );
}

type NoticeBoardProps = { filters: NoticeFilters; result: Paginated<NoticeSummary> };

/** Filters (search and categories) next to the paginated notices. All filtering happens on the server. */
export function NoticeBoard({ filters, result }: NoticeBoardProps) {
  const filtersText = [
    filters.category && ` in ${NOTICE_CATEGORY_LABELS[filters.category]}`,
    filters.q && ` matching "${filters.q}"`,
  ]
    .filter(Boolean)
    .join("");

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h2 className="visually-hidden">Notices</h2>
        <ResultsSummary
          meta={result.meta}
          noun="notices"
          filtersText={filtersText}
          emptyText="No notices match your search."
        />
        {result.data.length === 0 ? (
          <div className="empty-state">
            <p>Try another search, or see all notices.</p>
            <Link href="/notices" className="btn-outline-main">
              Clear filters
            </Link>
          </div>
        ) : (
          <ul className="list-unstyled">
            {result.data.map((notice) => (
              <li key={notice.slug}>
                <NoticeRow notice={notice} />
              </li>
            ))}
          </ul>
        )}
        <Pagination
          page={result.meta.page}
          totalPages={result.meta.totalPages}
          hrefForPage={(page) => noticesHref({ ...filters, page })}
        />
      </div>

      <aside className="col-lg-4" aria-label="Filter notices">
        <div className="sidebar-box">
          <h2>Search</h2>
          <Form action="/notices" role="search" aria-label="Notices" className="search-field">
            {filters.category && <input type="hidden" name="category" value={filters.category} />}
            <label htmlFor="notice-search" className="visually-hidden">
              Search notices
            </label>
            <input
              key={filters.q ?? ""}
              id="notice-search"
              type="search"
              name="q"
              defaultValue={filters.q}
              maxLength={100}
              className="form-control"
              placeholder="Search notices"
            />
            <button type="submit" className="btn-main">
              <Icon name="search" label="Search" />
            </button>
          </Form>
        </div>
        <div className="sidebar-box">
          <h2>Categories</h2>
          <ul className="plain filter-list">
            <li>
              <Link
                href={noticesHref({ q: filters.q })}
                className={!filters.category ? "active" : undefined}
                aria-current={!filters.category ? "true" : undefined}
              >
                All notices
              </Link>
            </li>
            {NOTICE_CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={noticesHref({ category, q: filters.q })}
                  className={filters.category === category ? "active" : undefined}
                  aria-current={filters.category === category ? "true" : undefined}
                >
                  {NOTICE_CATEGORY_LABELS[category]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

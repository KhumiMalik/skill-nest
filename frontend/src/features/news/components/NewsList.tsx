import Form from "next/form";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import { ResultsSummary } from "@/components/ui/ResultsSummary";
import type { Paginated } from "@/lib/api/schemas";
import { isUnfiltered, type NewsFilters, newsHref } from "../filters";
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS } from "../schemas";
import type { NewsSummary } from "../types";
import { NewsMediaCard, NewsRowCard } from "./NewsMediaCard";

type NewsListProps = {
  filters: NewsFilters;
  result: Paginated<NewsSummary>;
};

/**
 * The /news listing: top stories (plain first page only), category links, search and the
 * paginated grid. Every filter is a URL, read by the server.
 */
export function NewsList({ filters, result }: NewsListProps) {
  const [lead, ...others] = result.data;
  const showTopStories = isUnfiltered(filters) && lead !== undefined;
  // On the plain first page the four newest articles are the top stories, so the grid starts after them.
  const gridArticles = showTopStories ? result.data.slice(4) : result.data;
  const filtersText = [
    filters.category && ` in ${NEWS_CATEGORY_LABELS[filters.category]}`,
    filters.q && ` matching "${filters.q}"`,
  ]
    .filter(Boolean)
    .join("");

  return (
    <>
      {showTopStories && (
        <section className="mb-5" aria-labelledby="top-stories-heading">
          <h2 id="top-stories-heading" className="visually-hidden">
            Top stories
          </h2>
          <div className="row g-4">
            <div className="col-lg-7">
              <NewsMediaCard article={lead} lead />
            </div>
            <ul className="col-lg-5 list-unstyled d-flex flex-column gap-4 mb-0">
              {others.slice(0, 3).map((article) => (
                <li key={article.slug}>
                  <NewsRowCard article={article} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="list-toolbar">
        <nav aria-label="News categories">
          <ul className="filter-links">
            <li>
              <Link
                href={newsHref({ q: filters.q })}
                className={!filters.category ? "active" : undefined}
                aria-current={!filters.category ? "true" : undefined}
              >
                All news
              </Link>
            </li>
            {NEWS_CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={newsHref({ category, q: filters.q })}
                  className={filters.category === category ? "active" : undefined}
                  aria-current={filters.category === category ? "true" : undefined}
                >
                  {NEWS_CATEGORY_LABELS[category]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <NewsSearchForm filters={filters} />
      </div>

      <h2 className="visually-hidden">All news</h2>
      <ResultsSummary
        meta={result.meta}
        noun="articles"
        filtersText={filtersText}
        emptyText="No articles match your search."
      />

      {result.data.length === 0 ? (
        <div className="empty-state">
          <p>Try another search, or browse all our news.</p>
          <Link href="/news" className="btn-outline-main">
            Clear filters
          </Link>
        </div>
      ) : (
        <ul className="row g-4 list-unstyled">
          {gridArticles.map((article) => (
            <li className="col-lg-4 col-md-6" key={article.slug}>
              <NewsMediaCard article={article} />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={result.meta.page}
        totalPages={result.meta.totalPages}
        hrefForPage={(page) => newsHref({ ...filters, page })}
      />
    </>
  );
}

/** GET search form for news. Keeps the selected category; `next/form` navigates client-side. */
export function NewsSearchForm({ filters }: { filters?: Pick<NewsFilters, "category" | "q"> }) {
  return (
    <Form action="/news" role="search" aria-label="News" className="search-field">
      {filters?.category && <input type="hidden" name="category" value={filters.category} />}
      <label htmlFor="news-search" className="visually-hidden">
        Search news
      </label>
      <input
        // A new key resets the field when the URL changes (e.g. after "Clear filters").
        key={filters?.q ?? ""}
        id="news-search"
        type="search"
        name="q"
        defaultValue={filters?.q}
        maxLength={100}
        className="form-control"
        placeholder="Search news"
      />
      <button type="submit" className="btn-main">
        <Icon name="search" label="Search" />
      </button>
    </Form>
  );
}

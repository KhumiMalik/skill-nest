import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner } from "@/components/layout/PageBanner";
import { LinkIndex, ResultsSkeleton } from "@/components/ui/ResultsSkeleton";
import { getNews, NEWS_PAGE_SIZE, NewsList, parseNewsFilters } from "@/features/news";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "News",
  description:
    "The latest news from Greenfield Academy: achievements, sport, the arts, trips and everyday life at school.",
  path: "/news",
});

/**
 * The banner is prerendered; the list depends on ?category=&q=&page=, so it streams in.
 * Visitors without JavaScript get a plain list of the latest articles instead.
 */
export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const latest = await getNews({ pageSize: 30 });

  return (
    <>
      <PageBanner title="News" description="Achievements, events and everyday moments from around the school." />
      <section className="section">
        <div className="container">
          <Suspense
            fallback={
              <ResultsSkeleton
                variant="cards"
                label="Loading news"
                noScriptFallback={
                  <LinkIndex
                    title="Latest news"
                    note="Searching and filtering need JavaScript. Here are our latest articles."
                    items={latest.data.map((article) => ({
                      href: `/news/${article.slug}`,
                      title: article.title,
                      meta: formatDate(article.publishedAt),
                    }))}
                  />
                }
              />
            }
          >
            <NewsResults searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function NewsResults({ searchParams }: { searchParams: PageProps<"/news">["searchParams"] }) {
  const filters = parseNewsFilters(await searchParams);
  const result = await getNews({
    category: filters.category,
    q: filters.q,
    page: filters.page,
    pageSize: NEWS_PAGE_SIZE,
  });
  return <NewsList filters={filters} result={result} />;
}

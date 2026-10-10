import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner } from "@/components/layout/PageBanner";
import { LinkIndex, ResultsSkeleton } from "@/components/ui/ResultsSkeleton";
import { getNotices, NoticeBoard, NOTICES_PAGE_SIZE, parseNoticeFilters } from "@/features/notices";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Notices",
  description: "Official notices for Greenfield Academy families: term dates, closures, examinations and more.",
  path: "/notices",
});

/** Like /news: the banner is prerendered and the filtered board streams in. */
export default async function NoticesPage({ searchParams }: PageProps<"/notices">) {
  const latest = await getNotices({ pageSize: 30 });

  return (
    <>
      <PageBanner
        title="Notices"
        description="Term dates, closures, examinations and other important information for families."
      />
      <section className="section">
        <div className="container">
          <Suspense
            fallback={
              <ResultsSkeleton
                variant="rows"
                count={5}
                label="Loading notices"
                noScriptFallback={
                  <LinkIndex
                    title="All notices"
                    note="Searching and filtering need JavaScript. Here are all current notices."
                    items={latest.data.map((notice) => ({
                      href: `/notices/${notice.slug}`,
                      title: notice.title,
                      meta: formatDate(notice.publishedAt),
                    }))}
                  />
                }
              />
            }
          >
            <NoticeResults searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function NoticeResults({ searchParams }: { searchParams: PageProps<"/notices">["searchParams"] }) {
  const filters = parseNoticeFilters(await searchParams);
  const result = await getNotices({
    category: filters.category,
    q: filters.q,
    page: filters.page,
    pageSize: NOTICES_PAGE_SIZE,
  });
  return <NoticeBoard filters={filters} result={result} />;
}

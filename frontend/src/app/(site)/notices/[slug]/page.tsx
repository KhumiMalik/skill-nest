import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import { getNotice, getNotices, NoticeView } from "@/features/notices";
import { pageMetadata } from "@/lib/seo/metadata";

/** A "blocking route", like the other detail pages (see docs/architecture.md). */
export const instant = false;

/** Prerender current notices at build time; new ones render on their first visit. */
export async function generateStaticParams() {
  const { data } = await getNotices({ pageSize: 50 });
  return data.map((notice) => ({ slug: notice.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notices/[slug]">): Promise<Metadata> {
  const notice = await getNotice((await params).slug);
  if (!notice) return { title: "Notice not found" };
  return pageMetadata({ title: notice.title, description: notice.summary, path: `/notices/${notice.slug}` });
}

export default async function NoticePage({ params }: PageProps<"/notices/[slug]">) {
  const { slug } = await params;
  const notice = await getNotice(slug);
  if (!notice) notFound();

  const { data: latest } = await getNotices({ pageSize: 6 });
  const others = latest.filter((item) => item.slug !== notice.slug).slice(0, 5);

  return (
    <>
      <PageBanner
        title={notice.title}
        breadcrumbs={[{ label: "Notices", href: "/notices" }, { label: notice.title }]}
      />
      <section className="section">
        <div className="container">
          <NoticeView notice={notice} others={others} />
        </div>
      </section>
    </>
  );
}

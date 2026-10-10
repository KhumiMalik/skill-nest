import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import {
  getLatestNews,
  getNews,
  getNewsArticle,
  getNewsCategories,
  NEWS_CATEGORY_LABELS,
  NewsArticleView,
  newsArticleJsonLd,
  NewsSidebar,
} from "@/features/news";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * A "blocking route": articles that were not prerendered (older ones, or published after the
 * build) render on the server on their first visit. Missing slugs get a real 404 status
 * (see docs/architecture.md, "Dynamic routes and not-found pages").
 */
export const instant = false;

/** Prerender the most recent articles at build time; older ones render on their first visit. */
export async function generateStaticParams() {
  const { data } = await getNews({ pageSize: 12 });
  return data.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const article = await getNewsArticle((await params).slug);
  if (!article) return { title: "Article not found" };
  return pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
    openGraph: { type: "article", publishedTime: article.publishedAt, authors: [article.author.name] },
    ownImage: true, // news/[slug]/opengraph-image.tsx
  });
}

export default async function NewsArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  const [categories, latest] = await Promise.all([getNewsCategories(), getLatestNews(4)]);
  const recent = latest.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={newsArticleJsonLd(article)} />
      <PageBanner
        title={article.title}
        description={NEWS_CATEGORY_LABELS[article.category]}
        breadcrumbs={[{ label: "News", href: "/news" }, { label: article.title }]}
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <NewsArticleView article={article} />
            </div>
            <div className="col-lg-4">
              <NewsSidebar categories={categories} recent={recent} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

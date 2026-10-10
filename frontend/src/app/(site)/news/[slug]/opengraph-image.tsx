import { getNews, getNewsArticle, NEWS_CATEGORY_LABELS } from "@/features/news";
import { formatDate } from "@/lib/dates";
import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/seo/og-image";

// Share image for a news article: its title, category and date.
export const alt = "Greenfield Academy news article";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

/** Same articles as the page prerenders, so their images are generated at build time too. */
export async function generateStaticParams() {
  const { data } = await getNews({ pageSize: 12 });
  return data.map((article) => ({ slug: article.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getNewsArticle((await params).slug);
  if (!article) return renderOgImage({ eyebrow: "News", title: "Greenfield Academy News" });
  return renderOgImage({
    eyebrow: `News · ${NEWS_CATEGORY_LABELS[article.category]}`,
    title: article.title,
    detail: formatDate(article.publishedAt),
  });
}

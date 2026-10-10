import { absoluteUrl } from "@/lib/seo/metadata";
import { type JsonLd, schoolReference } from "@/lib/seo/json-ld";
import { NEWS_CATEGORY_LABELS } from "./schemas";
import type { NewsArticle } from "./types";

/** schema.org NewsArticle for an article page (headline, image, dates, author, publisher). */
export function newsArticleJsonLd(article: NewsArticle): JsonLd {
  return {
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.image.src],
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: article.author.name, jobTitle: article.author.role },
    publisher: { ...schoolReference(), logo: absoluteUrl("/apple-icon") },
    mainEntityOfPage: absoluteUrl(`/news/${article.slug}`),
    articleSection: NEWS_CATEGORY_LABELS[article.category],
    keywords: article.tags.join(", "),
  };
}

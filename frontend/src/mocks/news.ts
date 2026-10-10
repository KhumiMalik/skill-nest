import { NEWS_CATEGORIES } from "@/features/news/schemas";
import type { NewsListQuery } from "@/features/news";
import { ApiError } from "@/lib/api/errors";
import { paginate } from "@/lib/api/pagination";
import { news } from "./data/news";
import { matchesSearch, parsePagination, pick } from "./utils";

const SUMMARY_KEYS = ["slug", "title", "excerpt", "category", "publishedAt", "image", "author"] as const;

const newestFirst = () => [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

/** Replaces `GET /api/v1/news?category=&q=&page=&pageSize=` (newest first). */
export function listNews(query: Partial<NewsListQuery>) {
  const matches = newestFirst().filter(
    (article) =>
      (query.category === undefined || article.category === query.category) &&
      (!query.q || matchesSearch(query.q, article.title, article.excerpt, ...article.tags)),
  );
  return paginate(
    // The list returns summaries: the author's bio is only part of the full article.
    matches.map((article) => ({
      ...pick(article, SUMMARY_KEYS),
      author: pick(article.author, ["name", "role", "photo"]),
    })),
    parsePagination(query),
  );
}

/** Replaces `GET /api/v1/news/{slug}` */
export function getNewsArticle(slug: string) {
  const article = news.find((a) => a.slug === slug);
  if (!article) throw new ApiError(404, { message: "Article not found." });
  return article;
}

/** Replaces `GET /api/v1/news/categories` (every category, in display order, with its article count). */
export function listNewsCategories() {
  const counts = NEWS_CATEGORIES.map((category) => ({
    category,
    count: news.filter((article) => article.category === category).length,
  }));
  return paginate(counts, parsePagination({ pageSize: 50 }));
}

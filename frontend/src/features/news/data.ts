import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, isNotFound, mockApi, type Paginated, paginatedSchema, slugSchema } from "@/lib/api";
import { newsArticleSchema, newsCategoryCountSchema, newsSummarySchema } from "./schemas";
import type { NewsArticle, NewsCategoryCount, NewsListQuery, NewsSummary } from "./types";

/** Articles per page on /news (three rows of three cards). */
export const NEWS_PAGE_SIZE = 9;

// News is published throughout the day and the backend revalidates the `news` tag when it
// does (Phase 7). Lists use "hours" as a safety net; a published article rarely changes.

/** One page of news, newest first. Each filter combination is its own cache entry. */
export async function getNews(query: Partial<NewsListQuery> = {}): Promise<Paginated<NewsSummary>> {
  "use cache";
  cacheLife("hours");
  cacheTag("news");
  return apiRequest({
    method: "GET",
    path: "/news",
    query,
    schema: paginatedSchema(newsSummarySchema),
    mock: () => mockApi.news.list(query),
  });
}

/** The newest articles, for the home page and sidebars. */
export async function getLatestNews(limit = 3): Promise<NewsSummary[]> {
  const { data } = await getNews({ pageSize: limit });
  return data;
}

/** An article, or `null` if the slug doesn't exist (the page then shows a 404). */
export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  // Malformed slugs from hand-typed URLs never reach the API or the cache.
  if (!slugSchema.safeParse(slug).success) return null;
  return fetchNewsArticle(slug);
}

async function fetchNewsArticle(slug: string): Promise<NewsArticle | null> {
  "use cache";
  cacheLife("days");
  cacheTag("news", `news:${slug}`);
  try {
    return await apiRequest({
      method: "GET",
      path: `/news/${encodeURIComponent(slug)}`,
      schema: newsArticleSchema,
      mock: () => mockApi.news.get(slug),
    });
  } catch (error) {
    // Return null instead of throwing: errors don't keep their class when they cross a cache boundary.
    if (isNotFound(error)) return null;
    throw error;
  }
}

/** Article counts per category, for the sidebar. */
export async function getNewsCategories(): Promise<NewsCategoryCount[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("news");
  const result = await apiRequest({
    method: "GET",
    path: "/news/categories",
    schema: paginatedSchema(newsCategoryCountSchema),
    mock: () => mockApi.news.categories(),
  });
  return result.data;
}

import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, mockApi, paginatedSchema } from "@/lib/api";
import { newsSummarySchema } from "./schemas";
import type { NewsSummary } from "./types";

/** The newest articles, for the home page. */
export async function getLatestNews(limit = 3): Promise<NewsSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("news");
  const query = { pageSize: limit };
  const result = await apiRequest({
    method: "GET",
    path: "/news",
    query,
    schema: paginatedSchema(newsSummarySchema),
    mock: () => mockApi.news.list(query),
  });
  return result.data;
}

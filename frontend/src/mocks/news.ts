import { paginate } from "@/lib/api/pagination";
import type { PaginationQuery } from "@/lib/api/schemas";
import { news } from "./data/news";
import { parsePagination } from "./utils";

/** Replaces `GET /api/v1/news?page=&pageSize=` (newest first). Category and search filters come in Phase 4. */
export function listNews(query: Partial<PaginationQuery>) {
  const sorted = [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return paginate(sorted, parsePagination(query));
}

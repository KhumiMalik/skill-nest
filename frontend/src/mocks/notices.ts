import type { NoticeListQuery } from "@/features/notices";
import { ApiError } from "@/lib/api/errors";
import { paginate } from "@/lib/api/pagination";
import { notices } from "./data/notices";
import { matchesSearch, parsePagination, pick } from "./utils";

const SUMMARY_KEYS = ["slug", "title", "summary", "category", "publishedAt", "important", "audience"] as const;

/** Replaces `GET /api/v1/notices?category=&q=&page=&pageSize=` (important first, then newest first). */
export function listNotices(query: Partial<NoticeListQuery>) {
  const matches = notices
    .filter(
      (notice) =>
        (query.category === undefined || notice.category === query.category) &&
        (!query.q || matchesSearch(query.q, notice.title, notice.summary)),
    )
    .sort((a, b) => Number(b.important) - Number(a.important) || b.publishedAt.localeCompare(a.publishedAt));
  return paginate(
    matches.map((notice) => pick(notice, SUMMARY_KEYS)),
    parsePagination(query),
  );
}

/** Replaces `GET /api/v1/notices/{slug}` */
export function getNotice(slug: string) {
  const notice = notices.find((n) => n.slug === slug);
  if (!notice) throw new ApiError(404, { message: "Notice not found." });
  return notice;
}

import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, isNotFound, mockApi, type Paginated, paginatedSchema, slugSchema } from "@/lib/api";
import { noticeSchema, noticeSummarySchema } from "./schemas";
import type { Notice, NoticeListQuery, NoticeSummary } from "./types";

/** Notices per page on /notices. */
export const NOTICES_PAGE_SIZE = 8;

// Notices can be urgent (a snow closure), so lists use "minutes" as the safety net on top of
// tag revalidation. Anything under 5 minutes would stop the result being prerendered.

/** One page of notices: important first, then newest first. */
export async function getNotices(query: Partial<NoticeListQuery> = {}): Promise<Paginated<NoticeSummary>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("notices");
  return apiRequest({
    method: "GET",
    path: "/notices",
    query,
    schema: paginatedSchema(noticeSummarySchema),
    mock: () => mockApi.notices.list(query),
  });
}

/** A notice, or `null` if the slug doesn't exist (the page then shows a 404). */
export async function getNotice(slug: string): Promise<Notice | null> {
  if (!slugSchema.safeParse(slug).success) return null;
  return fetchNotice(slug);
}

async function fetchNotice(slug: string): Promise<Notice | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("notices", `notice:${slug}`);
  try {
    return await apiRequest({
      method: "GET",
      path: `/notices/${encodeURIComponent(slug)}`,
      schema: noticeSchema,
      mock: () => mockApi.notices.get(slug),
    });
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

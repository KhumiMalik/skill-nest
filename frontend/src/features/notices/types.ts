import type { z } from "zod";
import type { noticeCategorySchema, noticeListQuerySchema, noticeSchema, noticeSummarySchema } from "./schemas";

export type NoticeCategory = z.infer<typeof noticeCategorySchema>;
export type NoticeSummary = z.infer<typeof noticeSummarySchema>;
export type Notice = z.infer<typeof noticeSchema>;
export type NoticeListQuery = z.infer<typeof noticeListQuerySchema>;

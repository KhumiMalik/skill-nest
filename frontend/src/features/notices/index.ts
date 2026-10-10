// Public API of the notices feature. Other code imports from "@/features/notices" only.
export { NoticeBoard } from "./components/NoticeBoard";
export { NoticeView } from "./components/NoticeView";
export { getNotice, getNotices, NOTICES_PAGE_SIZE } from "./data";
export { type NoticeFilters, noticesHref, parseNoticeFilters } from "./filters";
export type * from "./types";

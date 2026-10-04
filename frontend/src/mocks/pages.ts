import { ApiError } from "@/lib/api/errors";
import { aboutPage, homePage, programsPage } from "./data/page-content";

const pages = { home: homePage, about: aboutPage, programs: programsPage };

/** Replaces `GET /api/v1/pages/{key}` */
export function getPage(key: string) {
  if (!Object.hasOwn(pages, key)) throw new ApiError(404, { message: "Page not found." });
  return pages[key as keyof typeof pages];
}

import { ApiError } from "@/lib/api/errors";
import { paginate } from "@/lib/api/pagination";
import type { PaginationQuery } from "@/lib/api/schemas";
import { albums } from "./data/gallery";
import { parsePagination, pick } from "./utils";

const SUMMARY_KEYS = ["slug", "title", "description", "date", "cover", "photoCount"] as const;

/** Replaces `GET /api/v1/gallery/albums?page=&pageSize=` (newest first). */
export function listAlbums(query: Partial<PaginationQuery>) {
  const sorted = [...albums].sort((a, b) => b.date.localeCompare(a.date));
  return paginate(
    sorted.map((album) => pick(album, SUMMARY_KEYS)),
    parsePagination(query),
  );
}

/** Replaces `GET /api/v1/gallery/albums/{slug}` */
export function getAlbum(slug: string) {
  const album = albums.find((a) => a.slug === slug);
  if (!album) throw new ApiError(404, { message: "Album not found." });
  return album;
}

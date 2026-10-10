import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, isNotFound, mockApi, paginatedSchema, slugSchema } from "@/lib/api";
import { albumSchema, albumSummarySchema } from "./schemas";
import type { Album, AlbumSummary } from "./types";

/** All albums, newest first. A school publishes a few a month, so one page of 50 is plenty. */
export async function getAlbums(): Promise<AlbumSummary[]> {
  "use cache";
  cacheLife("days");
  cacheTag("gallery");
  const query = { pageSize: 50 };
  const { data } = await apiRequest({
    method: "GET",
    path: "/gallery/albums",
    query,
    schema: paginatedSchema(albumSummarySchema),
    mock: () => mockApi.gallery.list(query),
  });
  return data;
}

/** An album with its photos, or `null` if the slug doesn't exist (the page then shows a 404). */
export async function getAlbum(slug: string): Promise<Album | null> {
  if (!slugSchema.safeParse(slug).success) return null;
  return fetchAlbum(slug);
}

async function fetchAlbum(slug: string): Promise<Album | null> {
  "use cache";
  cacheLife("days");
  cacheTag("gallery", `album:${slug}`);
  try {
    return await apiRequest({
      method: "GET",
      path: `/gallery/albums/${encodeURIComponent(slug)}`,
      schema: albumSchema,
      mock: () => mockApi.gallery.get(slug),
    });
  } catch (error) {
    // Return null instead of throwing: errors don't keep their class when they cross a cache boundary.
    if (isNotFound(error)) return null;
    throw error;
  }
}

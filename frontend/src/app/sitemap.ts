import type { MetadataRoute } from "next";
import { getVacancies } from "@/features/careers";
import { getEvents } from "@/features/events";
import { getFaculty } from "@/features/faculty";
import { getAlbums } from "@/features/gallery";
import { getNews } from "@/features/news";
import { getNotices } from "@/features/notices";
import { getPrograms } from "@/features/programs";
import type { Paginated } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo/metadata";

/** Pages that exist once. Filtered list URLs (?category=) are left out: their items are listed below. */
const STATIC_PATHS = [
  "/",
  "/about",
  "/admissions",
  "/programs",
  "/faculty",
  "/campus",
  "/student-life",
  "/news",
  "/notices",
  "/events",
  "/gallery",
  "/alumni",
  "/careers",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];

/** Every item of a paginated list (the API returns at most 50 per page). */
async function allPages<T>(fetchPage: (page: number) => Promise<Paginated<T>>): Promise<T[]> {
  const first = await fetchPage(1);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.meta.totalPages - 1) }, (_, index) => fetchPage(index + 2)),
  );
  return [first, ...rest].flatMap((page) => page.data);
}

/**
 * /sitemap.xml: every public page, so search engines find articles and events that are no longer
 * linked from the first page of a list. It uses the same cached reads as the pages, so it refreshes
 * with them (and with the revalidation webhook). Past a few thousand URLs, split it with generateSitemaps.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, faculty, news, notices, events, albums, vacancies] = await Promise.all([
    getPrograms(),
    allPages((page) => getFaculty({ page, pageSize: 50 })),
    allPages((page) => getNews({ page, pageSize: 50 })),
    allPages((page) => getNotices({ page, pageSize: 50 })),
    allPages((page) => getEvents({ page, pageSize: 50 })),
    getAlbums(),
    getVacancies(),
  ]);

  const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    ...(lastModified && { lastModified }),
  });

  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    ...programs.map((program) => entry(`/programs/${program.slug}`)),
    ...faculty.map((member) => entry(`/faculty/${member.slug}`)),
    ...news.map((article) => entry(`/news/${article.slug}`, article.publishedAt)),
    ...notices.map((notice) => entry(`/notices/${notice.slug}`, notice.publishedAt)),
    ...events.map((event) => entry(`/events/${event.slug}`)),
    ...albums.map((album) => entry(`/gallery/${album.slug}`)),
    ...vacancies.map((vacancy) => entry(`/careers/${vacancy.slug}`, vacancy.postedAt)),
  ];
}

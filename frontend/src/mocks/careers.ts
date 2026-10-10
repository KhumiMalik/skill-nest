import type { VacancyListQuery } from "@/features/careers";
import { ApiError } from "@/lib/api/errors";
import { paginate } from "@/lib/api/pagination";
import { vacancies } from "./data/careers";
import { parsePagination, pick } from "./utils";

const SUMMARY_KEYS = [
  "slug",
  "title",
  "category",
  "department",
  "contract",
  "pattern",
  "salary",
  "startDate",
  "postedAt",
  "closesAt",
  "summary",
] as const;

/**
 * Replaces `GET /api/v1/careers/vacancies?category=&page=&pageSize=`: open vacancies only (closing date
 * still ahead), closing soonest first. `now` is a parameter so tests can pick the date.
 */
export function listVacancies(query: Partial<VacancyListQuery>, now: Date = new Date()) {
  const matches = vacancies
    .filter(
      (vacancy) =>
        new Date(vacancy.closesAt) > now && (query.category === undefined || vacancy.category === query.category),
    )
    .sort((a, b) => a.closesAt.localeCompare(b.closesAt));
  return paginate(
    matches.map((vacancy) => pick(vacancy, SUMMARY_KEYS)),
    parsePagination(query),
  );
}

/** Replaces `GET /api/v1/careers/vacancies/{slug}`. Closed vacancies are still returned. */
export function getVacancy(slug: string) {
  const vacancy = vacancies.find((v) => v.slug === slug);
  if (!vacancy) throw new ApiError(404, { message: "Vacancy not found." });
  return vacancy;
}

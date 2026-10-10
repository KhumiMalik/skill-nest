import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, isNotFound, mockApi, paginatedSchema, slugSchema } from "@/lib/api";
import { vacancySchema, vacancySummarySchema } from "./schemas";
import type { Vacancy, VacancySummary } from "./types";

// Vacancies close at a set time, and the API stops listing them then, so lists are cached for
// "hours": a closed vacancy disappears at most an hour late even if no webhook arrives.

/** Open vacancies, closing soonest first. */
export async function getVacancies(): Promise<VacancySummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("careers");
  const query = { pageSize: 50 };
  const { data } = await apiRequest({
    method: "GET",
    path: "/careers/vacancies",
    query,
    schema: paginatedSchema(vacancySummarySchema),
    mock: () => mockApi.careers.list(query),
  });
  return data;
}

/**
 * Whether the closing date has passed. It depends on the current time, so the answer is cached
 * for an hour: reading the clock is allowed inside a cache scope (as in the events' hasPassed).
 */
export async function hasVacancyClosed(closesAt: string): Promise<boolean> {
  "use cache";
  cacheLife("hours");
  return new Date(closesAt).getTime() <= Date.now();
}

/** A vacancy (open or closed), or `null` if the slug doesn't exist (the page then shows a 404). */
export async function getVacancy(slug: string): Promise<Vacancy | null> {
  if (!slugSchema.safeParse(slug).success) return null;
  return fetchVacancy(slug);
}

async function fetchVacancy(slug: string): Promise<Vacancy | null> {
  "use cache";
  cacheLife("days");
  cacheTag("careers", `vacancy:${slug}`);
  try {
    return await apiRequest({
      method: "GET",
      path: `/careers/vacancies/${encodeURIComponent(slug)}`,
      schema: vacancySchema,
      mock: () => mockApi.careers.get(slug),
    });
  } catch (error) {
    // Return null instead of throwing: errors don't keep their class when they cross a cache boundary.
    if (isNotFound(error)) return null;
    throw error;
  }
}

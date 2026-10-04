import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, isNotFound, mockApi, paginatedSchema, slugSchema } from "@/lib/api";
import { programSchema, programSummarySchema } from "./schemas";
import type { Program, ProgramListQuery, ProgramSummary } from "./types";

/** All programs matching the filters. A school has a few dozen at most, so one page of 50 is enough. */
export async function getPrograms(filters: ProgramListQuery = {}): Promise<ProgramSummary[]> {
  "use cache";
  cacheLife("days");
  cacheTag("programs");
  const query = { ...filters, pageSize: 50 };
  const result = await apiRequest({
    method: "GET",
    path: "/programs",
    query,
    schema: paginatedSchema(programSummarySchema),
    mock: () => mockApi.programs.list(query),
  });
  return result.data;
}

/** One program, or `null` if the slug doesn't exist (the page then shows a 404). */
export async function getProgram(slug: string): Promise<Program | null> {
  // Malformed slugs from hand-typed URLs never reach the API or the cache.
  if (!slugSchema.safeParse(slug).success) return null;
  return fetchProgram(slug);
}

async function fetchProgram(slug: string): Promise<Program | null> {
  "use cache";
  cacheLife("days");
  cacheTag("programs", `program:${slug}`);
  try {
    return await apiRequest({
      method: "GET",
      path: `/programs/${encodeURIComponent(slug)}`,
      schema: programSchema,
      mock: () => mockApi.programs.get(slug),
    });
  } catch (error) {
    // Return null instead of throwing: errors don't keep their class when they cross a cache boundary.
    if (isNotFound(error)) return null;
    throw error;
  }
}

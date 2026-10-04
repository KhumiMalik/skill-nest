import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, isNotFound, mockApi, type Paginated, paginatedSchema, slugSchema } from "@/lib/api";
import { departmentSchema, facultyMemberSchema, facultySummarySchema } from "./schemas";
import type { Department, FacultyListQuery, FacultyMember, FacultySummary } from "./types";

/** People per page in the staff directory (four rows of three cards). */
export const FACULTY_PAGE_SIZE = 12;

/**
 * One page of the staff directory. Each filter combination is its own cache entry,
 * because the arguments are part of the cache key.
 */
export async function getFaculty(query: Partial<FacultyListQuery> = {}): Promise<Paginated<FacultySummary>> {
  "use cache";
  cacheLife("days");
  cacheTag("faculty");
  return apiRequest({
    method: "GET",
    path: "/faculty",
    query,
    schema: paginatedSchema(facultySummarySchema),
    mock: () => mockApi.faculty.list(query),
  });
}

/** A staff profile, or `null` if the slug doesn't exist (the page then shows a 404). */
export async function getFacultyMember(slug: string): Promise<FacultyMember | null> {
  // Malformed slugs from hand-typed URLs never reach the API or the cache.
  if (!slugSchema.safeParse(slug).success) return null;
  return fetchFacultyMember(slug);
}

async function fetchFacultyMember(slug: string): Promise<FacultyMember | null> {
  "use cache";
  cacheLife("days");
  cacheTag("faculty", `faculty:${slug}`);
  try {
    return await apiRequest({
      method: "GET",
      path: `/faculty/${encodeURIComponent(slug)}`,
      schema: facultyMemberSchema,
      mock: () => mockApi.faculty.get(slug),
    });
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function getDepartments(): Promise<Department[]> {
  "use cache";
  cacheLife("days");
  // Staff counts change when people join or leave, so departments share the faculty tag.
  cacheTag("faculty", "departments");
  const result = await apiRequest({
    method: "GET",
    path: "/departments",
    query: { pageSize: 50 },
    schema: paginatedSchema(departmentSchema),
    mock: () => mockApi.departments.list(),
  });
  return result.data;
}

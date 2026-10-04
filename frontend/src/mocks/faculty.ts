import type { FacultyListQuery } from "@/features/faculty";
import { ApiError } from "@/lib/api/errors";
import { paginate } from "@/lib/api/pagination";
import { departments, faculty } from "./data/faculty";
import { matchesSearch, parsePagination, pick } from "./utils";

const SUMMARY_KEYS = ["slug", "name", "role", "department", "photo", "shortBio", "email"] as const;

/** Replaces `GET /api/v1/faculty?department=&q=&page=&pageSize=` */
export function listFaculty(query: Partial<FacultyListQuery>) {
  const matches = faculty.filter(
    (member) =>
      (query.department === undefined || member.department.slug === query.department) &&
      (!query.q || matchesSearch(query.q, member.name, member.role, member.department.name, ...member.subjects)),
  );
  return paginate(
    matches.map((member) => pick(member, SUMMARY_KEYS)),
    parsePagination(query),
  );
}

/** Replaces `GET /api/v1/faculty/{slug}` */
export function getFacultyMember(slug: string) {
  const member = faculty.find((m) => m.slug === slug);
  if (!member) throw new ApiError(404, { message: "Staff member not found." });
  return member;
}

/** Replaces `GET /api/v1/departments` */
export function listDepartments() {
  const withCounts = departments.map((department) => ({
    ...department,
    staffCount: faculty.filter((member) => member.department.slug === department.slug).length,
  }));
  return paginate(withCounts, parsePagination({ pageSize: 50 }));
}

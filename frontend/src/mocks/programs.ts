import type { ProgramListQuery } from "@/features/programs";
import { ApiError } from "@/lib/api/errors";
import { paginate } from "@/lib/api/pagination";
import type { PaginationQuery } from "@/lib/api/schemas";
import { programs } from "./data/programs";
import { parsePagination, pick } from "./utils";

const SUMMARY_KEYS = [
  "slug",
  "title",
  "level",
  "ageRange",
  "duration",
  "classSize",
  "summary",
  "image",
  "featured",
] as const;

/** Replaces `GET /api/v1/programs?level=&featured=&page=&pageSize=` */
export function listPrograms(query: ProgramListQuery & Partial<PaginationQuery>) {
  const matches = programs.filter(
    (program) =>
      (query.level === undefined || program.level === query.level) &&
      (query.featured === undefined || program.featured === query.featured),
  );
  return paginate(
    matches.map((program) => pick(program, SUMMARY_KEYS)),
    parsePagination(query),
  );
}

/** Replaces `GET /api/v1/programs/{slug}` */
export function getProgram(slug: string) {
  const program = programs.find((p) => p.slug === slug);
  if (!program) throw new ApiError(404, { message: "Program not found." });
  return program;
}

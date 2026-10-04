import { z } from "zod";
import { imageSchema, paginationQuerySchema, slugSchema } from "@/lib/api/schemas";

/** Returned by GET /departments. */
export const departmentSchema = z.object({
  slug: slugSchema,
  name: z.string(),
  description: z.string(),
  /** Bootstrap Icons name; unknown names fall back to a default icon. */
  icon: z.string().min(1),
  staffCount: z.number().int().nonnegative(),
});

/** Returned by GET /faculty (list). */
export const facultySummarySchema = z.object({
  slug: slugSchema,
  /** Full name with title, e.g. "Dr Amelia Hart". */
  name: z.string(),
  role: z.string(),
  department: z.object({ slug: slugSchema, name: z.string() }),
  photo: imageSchema,
  shortBio: z.string(),
  email: z.email().optional(),
});

/** Returned by GET /faculty/{slug} (profile). */
export const facultyMemberSchema = facultySummarySchema.extend({
  bio: z.array(z.string()).min(1),
  qualifications: z.array(z.string()),
  subjects: z.array(z.string()),
  joinedYear: z.number().int(),
});

/** Query params of GET /faculty. `q` matches name, role, department and subjects. */
export const facultyListQuerySchema = paginationQuerySchema.extend({
  department: slugSchema.optional(),
  q: z.string().trim().max(100).optional(),
});

/** The department that holds the senior leadership team (shown on the About page). */
export const LEADERSHIP_DEPARTMENT = "senior-leadership";

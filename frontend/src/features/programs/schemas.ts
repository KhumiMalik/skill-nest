import { z } from "zod";
import { imageSchema, slugSchema } from "@/lib/api/schemas";
import { PROGRAM_LEVELS } from "./constants";

export { PROGRAM_LEVEL_LABELS, PROGRAM_LEVELS } from "./constants";

export const programLevelSchema = z.enum(PROGRAM_LEVELS);

/** Returned by GET /programs (list). */
export const programSummarySchema = z.object({
  slug: slugSchema,
  title: z.string(),
  level: programLevelSchema,
  /** Human-readable, e.g. "Ages 11-14". */
  ageRange: z.string(),
  duration: z.string(),
  classSize: z.string(),
  summary: z.string(),
  image: imageSchema,
  /** Shown in "Featured Programs" on the home page. */
  featured: z.boolean(),
});

/** Returned by GET /programs/{slug} (detail). */
export const programSchema = programSummarySchema.extend({
  intake: z.string(),
  overview: z.array(z.string()).min(1),
  subjects: z.array(z.string()),
  highlights: z.array(z.string()),
});

/** Query params of GET /programs. */
export const programListQuerySchema = z.object({
  level: programLevelSchema.optional(),
  featured: z.boolean().optional(),
});

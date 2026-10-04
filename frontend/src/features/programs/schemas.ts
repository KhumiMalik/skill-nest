import { z } from "zod";
import { imageSchema, slugSchema } from "@/lib/api/schemas";

/** School stages, in the order pupils move through them. */
export const PROGRAM_LEVELS = ["early-years", "primary", "secondary", "sixth-form"] as const;
export const programLevelSchema = z.enum(PROGRAM_LEVELS);

export const PROGRAM_LEVEL_LABELS: Record<z.infer<typeof programLevelSchema>, string> = {
  "early-years": "Early Years",
  primary: "Primary",
  secondary: "Secondary",
  "sixth-form": "Sixth Form",
};

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

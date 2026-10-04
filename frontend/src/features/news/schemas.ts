import { z } from "zod";
import { dateTimeSchema, imageSchema, slugSchema } from "@/lib/api/schemas";

export const NEWS_CATEGORIES = ["school-life", "academics", "achievements", "sports", "arts", "community"] as const;
export const newsCategorySchema = z.enum(NEWS_CATEGORIES);

export const NEWS_CATEGORY_LABELS: Record<z.infer<typeof newsCategorySchema>, string> = {
  "school-life": "School Life",
  academics: "Academics",
  achievements: "Achievements",
  sports: "Sports",
  arts: "Arts",
  community: "Community",
};

/** Returned by GET /news (list), newest first. The full article (body) is added in Phase 4. */
export const newsSummarySchema = z.object({
  slug: slugSchema,
  title: z.string(),
  excerpt: z.string(),
  category: newsCategorySchema,
  publishedAt: dateTimeSchema,
  image: imageSchema,
  author: z.object({ name: z.string(), role: z.string(), photo: imageSchema }),
});

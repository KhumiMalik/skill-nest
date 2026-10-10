import { z } from "zod";
import { contentBlockSchema, dateTimeSchema, imageSchema, paginationQuerySchema, slugSchema } from "@/lib/api/schemas";

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

const authorSchema = z.object({ name: z.string(), role: z.string(), photo: imageSchema });

/** Returned by GET /news (list), newest first. */
export const newsSummarySchema = z.object({
  slug: slugSchema,
  title: z.string(),
  excerpt: z.string(),
  category: newsCategorySchema,
  publishedAt: dateTimeSchema,
  image: imageSchema,
  author: authorSchema,
});

/** Returned by GET /news/{slug} (article). */
export const newsArticleSchema = newsSummarySchema.extend({
  body: z.array(contentBlockSchema).min(1),
  tags: z.array(z.string()),
  author: authorSchema.extend({ bio: z.string() }),
});

/** Query params of GET /news. `q` matches title, excerpt and tags. */
export const newsListQuerySchema = paginationQuerySchema.extend({
  category: newsCategorySchema.optional(),
  q: z.string().trim().max(100).optional(),
});

/** Returned by GET /news/categories: how many articles each category has. */
export const newsCategoryCountSchema = z.object({ category: newsCategorySchema, count: z.number().int().min(0) });

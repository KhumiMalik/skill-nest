import type { z } from "zod";
import type {
  newsArticleSchema,
  newsCategoryCountSchema,
  newsCategorySchema,
  newsListQuerySchema,
  newsSummarySchema,
} from "./schemas";

export type NewsCategory = z.infer<typeof newsCategorySchema>;
export type NewsSummary = z.infer<typeof newsSummarySchema>;
export type NewsArticle = z.infer<typeof newsArticleSchema>;
export type NewsListQuery = z.infer<typeof newsListQuerySchema>;
export type NewsCategoryCount = z.infer<typeof newsCategoryCountSchema>;

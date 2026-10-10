import type { z } from "zod";
import type { albumSchema, albumSummarySchema } from "./schemas";

export type AlbumSummary = z.infer<typeof albumSummarySchema>;
export type Album = z.infer<typeof albumSchema>;

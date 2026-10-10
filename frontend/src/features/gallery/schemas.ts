import { z } from "zod";
import { imageSchema, photoSchema, slugSchema } from "@/lib/api/schemas";

/** Returned by GET /gallery/albums (list), newest first. */
export const albumSummarySchema = z.object({
  slug: slugSchema,
  title: z.string(),
  description: z.string(),
  /** When the photos were taken (the event's day, or the start of a term). */
  date: z.iso.date(),
  cover: imageSchema,
  photoCount: z.number().int().nonnegative(),
});

/** Returned by GET /gallery/albums/{slug}. */
export const albumSchema = albumSummarySchema.extend({ photos: z.array(photoSchema) });

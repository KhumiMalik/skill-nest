import { z } from "zod";

// Shared API envelope schemas. Framework-independent (no Next.js imports) so they can
// later move to a shared `packages/schemas` package used by the backend too.

/** Error body returned by every failing API call. 422 responses include field errors. */
export const apiErrorBodySchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});
export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;

export const paginationMetaSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

/** `{ data: T[], meta }` wrapper used by every list endpoint. */
export function paginatedSchema<T extends z.ZodType>(item: T) {
  return z.object({ data: z.array(item), meta: paginationMetaSchema });
}
export type Paginated<T> = { data: T[]; meta: PaginationMeta };

/** Query params accepted by every list endpoint. */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(9),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/** URL-safe identifier: lowercase words separated by hyphens, e.g. "annual-science-fair-2026". */
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");

/** Every image the API returns. Width and height let next/image reserve space and avoid layout shift. */
export const imageSchema = z.object({
  src: z.url(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ApiImage = z.infer<typeof imageSchema>;

/** ISO 8601 date-time with a time zone, e.g. "2026-02-15T09:00:00Z". */
export const dateTimeSchema = z.iso.datetime({ offset: true });

/** Body returned by successful POST endpoints that create something. */
export const createdSchema = z.object({ id: z.string(), message: z.string() });
export type Created = z.infer<typeof createdSchema>;

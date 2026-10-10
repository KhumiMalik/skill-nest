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

/** A photo in a gallery grid: the image plus an optional title (on the tile) and caption (in the lightbox). */
export const photoSchema = z.object({
  image: imageSchema,
  title: z.string().optional(),
  caption: z.string().optional(),
});
export type Photo = z.infer<typeof photoSchema>;

/** A path on this website, e.g. "/campus". Rejects "//other-site.com", which browsers treat as another host. */
export const sitePathSchema = z.string().regex(/^\/(?!\/)/, "Must be a path on this site");

const httpUrlSchema = z.url({ protocol: /^https?$/ });

/**
 * Where a link from the API may point: a site path, an http(s) URL or an email address.
 * `z.url()` alone would also accept `javascript:` URLs, which run code when clicked.
 */
export const linkHrefSchema = z.union([
  sitePathSchema,
  httpUrlSchema,
  z.string().regex(/^mailto:[^\s@]+@[^\s@]+$/, "Invalid email link"),
]);

/** A downloadable document, e.g. an application form. `url` is absolute (the mock API uses site paths). */
export const fileSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  url: z.union([sitePathSchema, httpUrlSchema]),
  /** Shown next to the link, e.g. "PDF". */
  format: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});
export type ApiFile = z.infer<typeof fileSchema>;

/** ISO 8601 date-time with a time zone, e.g. "2026-02-15T09:00:00Z". */
export const dateTimeSchema = z.iso.datetime({ offset: true });

/**
 * Rich text as a list of typed blocks (news articles, notices, event descriptions).
 * Structured blocks instead of HTML: the frontend renders them with its own components, so
 * nothing from the API is injected as raw HTML and no sanitiser is needed. Text is plain (no inline markup).
 */
export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: z.string().min(1) }),
  /** A section heading (rendered as h2). Headings also build the table of contents. */
  z.object({ type: z.literal("heading"), text: z.string().min(1) }),
  z.object({ type: z.literal("list"), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal("quote"), text: z.string().min(1), cite: z.string().optional() }),
  z.object({ type: z.literal("image"), image: imageSchema, caption: z.string().optional() }),
  /** A highlighted box, e.g. "Key dates" or "What to bring". */
  z.object({ type: z.literal("callout"), title: z.string().min(1), text: z.string().min(1) }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;

// ---- Fields shared by the POST endpoints (form submissions). Messages are shown to visitors. ----

export const personNameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name.")
  .max(100, "Names must be 100 characters or fewer.");

export const emailAddressSchema = z
  .email("Enter an email address in the correct format, like name@example.com.")
  .max(254, "Email addresses must be 254 characters or fewer.");

/** UK or international phone number: digits, spaces, brackets, dashes and a leading "+". */
export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a phone number, like 01632 960 001 or +44 1632 960 001.");

/** Free text such as a message, at most `max` characters. */
export function messageSchema(max: number, tooShort = "Enter a message.") {
  return z
    .string()
    .trim()
    .min(1, tooShort)
    .max(max, `Use ${max.toLocaleString("en-GB")} characters or fewer.`);
}

/** Body returned by successful POST endpoints that create something. */
export const createdSchema = z.object({ id: z.string(), message: z.string() });
export type Created = z.infer<typeof createdSchema>;

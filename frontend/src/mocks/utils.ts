import { validationError } from "@/lib/api/errors";
import { type ApiImage, type PaginationQuery, paginationQuerySchema } from "@/lib/api/schemas";

/**
 * Placeholder image object in the API's image shape. PNG (not placehold.co's default SVG)
 * because next/image only optimises raster images.
 */
export function placeholderImage(
  width: number,
  height: number,
  label: string,
  alt: string,
  colors: { background: string; text: string } = { background: "dfe6ef", text: "5b6b7f" },
): ApiImage {
  const text = encodeURIComponent(label).replace(/%20/g, "+");
  return {
    src: `https://placehold.co/${width}x${height}/${colors.background}/${colors.text}/png?text=${text}`,
    alt,
    width,
    height,
  };
}

/** Case- and accent-insensitive "contains" used by the mock search endpoints. */
export function matchesSearch(query: string, ...fields: string[]): boolean {
  const normalise = (value: string) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  const needle = normalise(query);
  return fields.some((field) => normalise(field).includes(needle));
}

/** Copies only the listed keys, e.g. to turn a full record into the summary a list endpoint returns. */
export function pick<T extends object, K extends keyof T>(source: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) result[key] = source[key];
  return result;
}

/** Validates page/pageSize like the backend: defaults when missing, 422 when invalid. */
export function parsePagination(query: { page?: number; pageSize?: number }): PaginationQuery {
  const parsed = paginationQuerySchema.safeParse({ page: query.page, pageSize: query.pageSize });
  if (!parsed.success) throw validationError(parsed.error);
  return parsed.data;
}

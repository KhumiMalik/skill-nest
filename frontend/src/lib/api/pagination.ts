import type { Paginated, PaginationQuery } from "./schemas";

/** Slices an in-memory list the same way the backend paginates. */
export function paginate<T>(items: readonly T[], { page, pageSize }: PaginationQuery): Paginated<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    meta: { page, pageSize, total, totalPages },
  };
}

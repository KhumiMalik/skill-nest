import "server-only";
import type { z } from "zod";
import { serverEnv } from "@/config/env";
import { request, type RequestOptions } from "./request";

/**
 * Server-only API client. Feature `data.ts` files call this; pages and components never do.
 *
 * Each call passes the matching `mockApi` handler as `mock`, e.g.
 * `apiRequest({ method: "GET", path: "/programs", query, schema, mock: () => mockApi.programs.list(query) })`.
 * Without API_BASE_URL the mock runs; with it, the real endpoint is called and `mock` is ignored.
 */
export function apiRequest<T extends z.ZodType>(options: RequestOptions<T>): Promise<z.infer<T>> {
  return request(
    {
      baseUrl: serverEnv.API_BASE_URL,
      mockDelayMs: serverEnv.MOCK_API_DELAY_MS ?? (serverEnv.NODE_ENV === "development" ? 300 : 0),
    },
    options,
  );
}

export { ApiError, isApiError, isNotFound, validationError } from "./errors";
export { paginate } from "./pagination";
// The API layer is the only place allowed to import mocks; it hands them to feature data.ts files.
export { mockApi } from "@/mocks";
export * from "./schemas";

import type { z } from "zod";
import { ApiError } from "./errors";
import { apiErrorBodySchema } from "./schemas";

export type HttpMethod = "GET" | "POST";
export type QueryValue = string | number | boolean | undefined;

export type RequestOptions<T extends z.ZodType> = {
  method: HttpMethod;
  /** Path below /api/v1, e.g. "/news" or "/events/open-day". */
  path: string;
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Validates the response. Types are inferred from it. */
  schema: T;
  /** Mock implementation of the same endpoint, used while no backend exists. */
  mock: () => unknown;
};

export type ApiConfig = {
  /** Backend base URL. Undefined means "use the mock handlers". */
  baseUrl: string | undefined;
  /** Artificial latency applied to mock calls, in ms. */
  mockDelayMs: number;
  fetchImpl?: typeof fetch;
};

/**
 * Single entry point for every API call.
 * With a base URL it calls the real REST API; without one it runs the mock handler.
 * Both paths validate the response with the same Zod schema and throw `ApiError` on failure,
 * so callers can't tell the difference.
 */
export async function request<T extends z.ZodType>(config: ApiConfig, options: RequestOptions<T>): Promise<z.infer<T>> {
  const raw = config.baseUrl ? await httpRequest(config, options) : await mockRequest(config, options);
  const parsed = options.schema.safeParse(raw);
  if (!parsed.success) {
    // The API returned something that doesn't match the contract: a bug, not a user error.
    throw new Error(`Invalid response from ${options.method} ${options.path}: ${parsed.error.message}`);
  }
  return parsed.data;
}

async function mockRequest<T extends z.ZodType>(config: ApiConfig, options: RequestOptions<T>): Promise<unknown> {
  if (config.mockDelayMs > 0) await new Promise((resolve) => setTimeout(resolve, config.mockDelayMs));
  // Round-trip through JSON so mocks behave like a real network response (no shared references, dates as strings).
  const result = options.mock();
  return result === undefined ? undefined : JSON.parse(JSON.stringify(result));
}

async function httpRequest<T extends z.ZodType>(config: ApiConfig, options: RequestOptions<T>): Promise<unknown> {
  const url = new URL(`/api/v1${options.path}`, config.baseUrl);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const response = await (config.fetchImpl ?? fetch)(url, {
    method: options.method,
    headers: { Accept: "application/json", ...(options.body !== undefined && { "Content-Type": "application/json" }) },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const payload: unknown = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (!response.ok) {
    const body = apiErrorBodySchema.safeParse(payload);
    throw new ApiError(
      response.status,
      body.success ? body.data : { message: response.statusText || "Request failed" },
    );
  }
  return payload;
}

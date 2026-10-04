import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError, validationError } from "./errors";
import { paginate } from "./pagination";
import { request } from "./request";
import { paginationQuerySchema } from "./schemas";

const itemSchema = z.object({ id: z.string(), title: z.string() });
const mockConfig = { baseUrl: undefined, mockDelayMs: 0 };

describe("request (mock mode)", () => {
  it("returns validated mock data", async () => {
    const result = await request(mockConfig, {
      method: "GET",
      path: "/items/1",
      schema: itemSchema,
      mock: () => ({ id: "1", title: "Open Day" }),
    });
    expect(result).toEqual({ id: "1", title: "Open Day" });
  });

  it("serialises mock data like a network response", async () => {
    const result = await request(mockConfig, {
      method: "GET",
      path: "/when",
      schema: z.object({ at: z.string() }),
      mock: () => ({ at: new Date("2026-01-01T00:00:00Z") }),
    });
    expect(result.at).toBe("2026-01-01T00:00:00.000Z");
  });

  it("propagates ApiError thrown by a mock handler", async () => {
    await expect(
      request(mockConfig, {
        method: "GET",
        path: "/items/missing",
        schema: itemSchema,
        mock: () => {
          throw new ApiError(404, { message: "Not found" });
        },
      }),
    ).rejects.toMatchObject({ status: 404, message: "Not found" });
  });

  it("rejects responses that break the contract", async () => {
    await expect(
      request(mockConfig, { method: "GET", path: "/items/1", schema: itemSchema, mock: () => ({ id: 1 }) }),
    ).rejects.toThrow(/Invalid response from GET \/items\/1/);
  });
});

describe("request (HTTP mode)", () => {
  function jsonResponse(status: number, body: unknown) {
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  }

  it("builds the URL with /api/v1 and skips empty query values", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(200, { id: "1", title: "A" }));
    await request(
      { baseUrl: "https://api.example.com", mockDelayMs: 0, fetchImpl },
      {
        method: "GET",
        path: "/items",
        query: { page: 2, q: "", category: undefined },
        schema: itemSchema,
        mock: () => null,
      },
    );
    const [url] = fetchImpl.mock.calls[0] as unknown as [URL];
    expect(url.toString()).toBe("https://api.example.com/api/v1/items?page=2");
  });

  it("maps a 422 response to ApiError with field errors", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(422, { message: "Invalid", errors: { email: ["Enter a valid email address."] } }),
    );
    const promise = request(
      { baseUrl: "https://api.example.com", mockDelayMs: 0, fetchImpl },
      { method: "POST", path: "/contact-messages", body: {}, schema: itemSchema, mock: () => null },
    );
    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({
      status: 422,
      fieldErrors: { email: ["Enter a valid email address."] },
    });
  });
});

describe("validationError", () => {
  it("turns Zod issues into a 422 body keyed by field", () => {
    const schema = z.object({ name: z.string().min(1, "Name is required") });
    const parsed = schema.safeParse({ name: "" });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    const error = validationError(parsed.error);
    expect(error.status).toBe(422);
    expect(error.fieldErrors).toEqual({ name: ["Name is required"] });
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 23 }, (_, i) => i + 1);

  it("returns the requested page and meta", () => {
    const result = paginate(items, paginationQuerySchema.parse({ page: "3", pageSize: "10" }));
    expect(result.data).toEqual([21, 22, 23]);
    expect(result.meta).toEqual({ page: 3, pageSize: 10, total: 23, totalPages: 3 });
  });

  it("returns an empty page past the end", () => {
    expect(paginate(items, { page: 9, pageSize: 10 }).data).toEqual([]);
  });
});

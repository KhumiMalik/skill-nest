import { describe, expect, it, vi } from "vitest";
import { handleRevalidateRequest } from "./revalidation";

const SECRET = "a-very-long-test-secret-0123456789abcdef";

function request(body: unknown, token: string | null = SECRET) {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("handleRevalidateRequest", () => {
  it("expires each requested tag once", async () => {
    const revalidate = vi.fn();
    const response = await handleRevalidateRequest(request({ tags: ["news", "news:sports-day", "news"] }), {
      secret: SECRET,
      revalidate,
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ revalidated: ["news", "news:sports-day"] });
    expect(revalidate.mock.calls).toEqual([["news"], ["news:sports-day"]]);
  });

  it("rejects a missing or wrong token with 401", async () => {
    const revalidate = vi.fn();
    for (const token of [null, "wrong-token"]) {
      const response = await handleRevalidateRequest(request({ tags: ["news"] }, token), {
        secret: SECRET,
        revalidate,
      });
      expect(response.status).toBe(401);
      expect(response.headers.get("WWW-Authenticate")).toBe("Bearer");
    }
    expect(revalidate).not.toHaveBeenCalled();
  });

  it("rejects invalid bodies with 422 and field errors", async () => {
    for (const body of ["not json", { tags: [] }, { tags: ["News Page"] }, {}]) {
      const response = await handleRevalidateRequest(request(body), { secret: SECRET, revalidate: vi.fn() });
      expect(response.status).toBe(422);
      expect(await response.json()).toHaveProperty("errors");
    }
  });

  it("answers 503 when no secret is configured", async () => {
    const response = await handleRevalidateRequest(request({ tags: ["news"] }), {
      secret: undefined,
      revalidate: vi.fn(),
    });
    expect(response.status).toBe(503);
  });
});

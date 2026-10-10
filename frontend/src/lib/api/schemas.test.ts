import { describe, expect, it } from "vitest";
import { linkHrefSchema, sitePathSchema } from "./schemas";

describe("link schemas", () => {
  it("accept site paths, http(s) URLs and email links", () => {
    for (const href of ["/campus", "/events?category=alumni", "https://example.com/a", "mailto:alumni@example.com"]) {
      expect(linkHrefSchema.safeParse(href).success).toBe(true);
    }
  });

  it("reject links that run code or leave the site unexpectedly", () => {
    for (const href of ["javascript:alert(1)", "//evil.example", "data:text/html,hi", "campus", ""]) {
      expect(linkHrefSchema.safeParse(href).success).toBe(false);
    }
    expect(sitePathSchema.safeParse("//evil.example/path").success).toBe(false);
  });
});

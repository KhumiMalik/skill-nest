import { expect, type Page, test } from "@playwright/test";

/** All JSON-LD objects on the page, parsed (each must be valid JSON). */
async function jsonLd(page: Page): Promise<Record<string, unknown>[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return scripts.map((text) => JSON.parse(text) as Record<string, unknown>);
}

const ofType = (items: Record<string, unknown>[], type: string) => items.find((item) => item["@type"] === type);

// Metadata and structured data don't depend on the viewport.
test.describe("SEO", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only");

  test("every page has a canonical URL and a share image", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/about$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "About Us");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/opengraph-image/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    expect(ofType(await jsonLd(page), "BreadcrumbList")).toBeTruthy();
  });

  test("the home page describes the school", async ({ page }) => {
    await page.goto("/");
    expect(ofType(await jsonLd(page), "School")).toMatchObject({
      name: "Greenfield Academy",
      address: { "@type": "PostalAddress", postalCode: "GF1 2AB" },
    });
  });

  test("news articles have NewsArticle data and their own share image", async ({ page, request }) => {
    await page.goto("/news/robotics-team-qualifies-for-national-final");
    expect(ofType(await jsonLd(page), "NewsArticle")).toMatchObject({
      headline: "Robotics team qualifies for the national final",
      datePublished: expect.any(String),
    });
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toContain("/news/robotics-team-qualifies-for-national-final/opengraph-image");
    const response = await request.get(new URL(image ?? "").pathname);
    expect(response.headers()["content-type"]).toBe("image/png");
  });

  test("events, FAQs and open vacancies have rich-result data", async ({ page }) => {
    await page.goto("/events/carol-service-2026");
    expect(ofType(await jsonLd(page), "Event")).toMatchObject({
      name: "Carol Service",
      location: { name: "St Mary's Church", address: "Church Street, Greenfield GF1 4SM" },
    });

    await page.goto("/faq");
    const faq = ofType(await jsonLd(page), "FAQPage") as { mainEntity: unknown[] };
    expect(faq.mainEntity.length).toBeGreaterThan(10);

    await page.goto("/careers/teacher-of-physics-2027");
    expect(ofType(await jsonLd(page), "JobPosting")).toMatchObject({ title: "Teacher of Physics" });
    // A closed vacancy keeps its page but drops the JobPosting.
    await page.goto("/careers/school-receptionist-2026");
    expect(ofType(await jsonLd(page), "JobPosting")).toBeUndefined();
  });

  test("robots.txt and the sitemap list the site", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /api/");
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of [
      "/admissions</loc>",
      "/news/robotics-team-qualifies-for-national-final</loc>",
      "/gallery/sports-day-2026</loc>",
    ]) {
      expect(sitemap).toContain(path);
    }
  });
});

test.describe("revalidation webhook", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only");

  // Matches REVALIDATE_SECRET in playwright.config.ts.
  const secret = "e2e-revalidate-secret-0123456789abcdef";

  test("needs the secret and valid tags", async ({ request }) => {
    expect((await request.post("/api/revalidate", { data: { tags: ["news"] } })).status()).toBe(401);
    expect(
      (
        await request.post("/api/revalidate", { headers: { Authorization: "Bearer wrong" }, data: { tags: ["news"] } })
      ).status(),
    ).toBe(401);

    const invalid = await request.post("/api/revalidate", {
      headers: { Authorization: `Bearer ${secret}` },
      data: { tags: ["Not a tag!"] },
    });
    expect(invalid.status()).toBe(422);

    const ok = await request.post("/api/revalidate", {
      headers: { Authorization: `Bearer ${secret}` },
      data: { tags: ["news", "pages:home"] },
    });
    expect(ok.status()).toBe(200);
    expect(await ok.json()).toMatchObject({ revalidated: ["news", "pages:home"] });

    // The home page still renders after its tags expired.
    expect((await request.get("/")).status()).toBe(200);
  });
});

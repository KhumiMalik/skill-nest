import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("foundation", () => {
  test("home page renders inside the site shell", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Greenfield Academy/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("unknown URLs show the 404 page with a 404 status", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  });

  test("security headers are sent", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("home and 404 pages have no detectable accessibility violations", async ({ page }) => {
    // Scroll-reveal content starts at opacity 0, which axe would report as low contrast.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/", "/this-page-does-not-exist"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations, `${path}: ${results.violations.map((v) => v.id).join(", ")}`).toEqual([]);
    }
  });
});

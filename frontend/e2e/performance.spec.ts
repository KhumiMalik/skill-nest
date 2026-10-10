import { expect, type Page, test } from "@playwright/test";

/**
 * Guards against accidentally shipping server code to the browser. It happened twice during
 * development: a Client Component importing a Zod schema file added ~90 KB to every page, and one
 * importing <Icon> added the whole icon set (~18 KB). Both are invisible in the UI, so test for them.
 */

/** The JavaScript files a page loads, with their (uncompressed) contents. */
async function loadScripts(page: Page, path: string): Promise<{ url: string; text: string }[]> {
  const pending: Promise<{ url: string; text: string }>[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "script" && response.url().includes("/_next/static/")) {
      pending.push(response.text().then((text) => ({ url: response.url(), text })));
    }
  });
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  return Promise.all(pending);
}

// Uncompressed JavaScript per page. React and the Next.js runtime are about 450 KB of it; the rest is ours.
const BUDGET_KB = 550; // pages measure 470-500 KB (October 2026)

test.describe("browser bundles", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop only: bundles don't depend on the viewport");

  for (const path of ["/", "/programs", "/contact", "/admissions", "/gallery/sports-day-2026", "/events"]) {
    test(`${path} ships no server-only code and stays within the JavaScript budget`, async ({ page }) => {
      const scripts = await loadScripts(page, path);
      for (const { url, text } of scripts) {
        expect(text, `Zod in ${url}: a Client Component imports a schemas.ts file`).not.toContain("ZodError");
        expect(text, `Full icon set in ${url}: a Client Component imports <Icon> (use <ClientIcon>)`).not.toContain(
          '"universal-access"',
        );
      }
      // The budget counts the scripts the page's HTML loads. The other responses above are chunks that
      // Next.js prefetches for links on the page, loaded after the page is ready.
      const html = await (await page.request.get(path)).text();
      const initial = new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]));
      const initialScripts = scripts.filter(({ url }) => initial.has(new URL(url).pathname));
      const totalKb = Math.round(initialScripts.reduce((sum, { text }) => sum + text.length, 0) / 1024);
      console.log(`${path}: ${initialScripts.length} scripts, ${totalKb} KB`);
      expect(totalKb).toBeLessThanOrEqual(BUDGET_KB);
    });
  }
});

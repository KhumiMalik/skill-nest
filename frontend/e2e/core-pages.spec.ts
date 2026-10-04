import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "Where curious minds grow into confident young people" },
  { path: "/about", heading: "About Us" },
  { path: "/programs", heading: "Programs" },
  { path: "/programs/a-level-programme", heading: "A Level Programme" },
  { path: "/faculty", heading: "Faculty & Staff" },
  { path: "/faculty/amelia-hart", heading: "Dr Amelia Hart" },
];

test.describe("core pages", () => {
  // Scroll-reveal content starts at opacity 0, which axe would report as low contrast.
  // With reduced motion the animation is off and every element shows its real colours.
  test.use({ reducedMotion: "reduce" });

  for (const { path, heading } of PAGES) {
    test(`${path} renders its heading and has no detectable accessibility violations`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations, results.violations.map((v) => v.id).join(", ")).toEqual([]);
    });
  }

  test("unknown program and staff slugs return 404", async ({ page }) => {
    for (const [path, heading] of [
      ["/programs/no-such-program", "Program not found"],
      ["/faculty/no-such-person", "Staff member not found"],
    ] as const) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    }
  });
});

test.describe("home page", () => {
  test("shows upcoming events and filters featured programs by stage", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Upcoming Events" })).toBeVisible();
    await expect(page.locator(".event-strip li")).toHaveCount(3);

    const cards = page.locator("#featured-programs article");
    const all = await cards.count();
    await page.getByRole("button", { name: "Sixth Form" }).click();
    await expect(page.getByRole("button", { name: "Sixth Form" })).toHaveAttribute("aria-pressed", "true");
    await expect(cards).not.toHaveCount(all);
    await expect(cards.first()).toContainText("Sixth Form");
  });
});

test.describe("programs page", () => {
  test("switches stages with the tabs, by mouse and keyboard", async ({ page }) => {
    await page.goto("/programs");
    const earlyYears = page.getByRole("tab", { name: "Early Years" });
    await expect(earlyYears).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Nursery");

    await page.getByRole("tab", { name: "Secondary" }).click();
    await expect(page.getByRole("tabpanel")).toContainText("GCSE Programme");

    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Sixth Form" })).toBeFocused();
    await expect(page.getByRole("tabpanel")).toContainText("A Level Programme");
  });

  test("program pages link to related programs", async ({ page }) => {
    await page.goto("/programs/a-level-programme");
    await page.getByRole("link", { name: "Extended Project Qualification" }).click();
    await expect(page).toHaveURL(/\/programs\/extended-project$/);
    await expect(page.getByRole("heading", { level: 1, name: "Extended Project Qualification" })).toBeVisible();
  });
});

test.describe("staff directory", () => {
  test("searches by name and keeps the query in the URL", async ({ page }) => {
    await page.goto("/faculty");
    await page.getByRole("searchbox", { name: "Search by name, role or subject" }).fill("hart");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/faculty\?q=hart$/);
    await expect(page.getByRole("status").filter({ hasText: "Showing" })).toHaveText(
      'Showing 1-1 of 1 staff members matching "hart"',
    );
    await expect(page.getByRole("link", { name: "Dr Amelia Hart", exact: true })).toBeVisible();
  });

  test("filters by department and paginates", async ({ page }) => {
    await page.goto("/faculty");
    await expect(page.getByText("Showing 1-12 of 26 staff members")).toBeVisible();
    await page.getByRole("link", { name: "Next page" }).click();
    await expect(page).toHaveURL(/\/faculty\?page=2$/);
    await expect(page.getByText("Showing 13-24 of 26 staff members")).toBeVisible();

    await page.getByRole("complementary", { name: "Filter staff" }).getByRole("link", { name: "Science" }).click();
    await expect(page).toHaveURL(/\/faculty\?department=science$/);
    await expect(page.getByText("Showing 1-3 of 3 staff members in Science")).toBeVisible();
  });

  test("shows an empty state for searches without results", async ({ page }) => {
    await page.goto("/faculty?q=zzzz");
    await expect(page.getByText("No staff members match your search.")).toBeVisible();
    await page.getByRole("link", { name: "Clear filters" }).click();
    await expect(page).toHaveURL(/\/faculty$/);
    await expect(page.getByRole("searchbox", { name: "Search by name, role or subject" })).toHaveValue("");
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    // The filtered directory streams in, which needs JavaScript; without it a plain staff list is shown.
    test("lists every staff member with links to their prerendered profiles", async ({ page }) => {
      await page.goto("/faculty");
      await expect(page.getByRole("heading", { name: "Staff directory" })).toBeVisible();
      await expect(page.locator(".directory-skeleton")).toBeHidden();
      await page.getByRole("link", { name: "Mr Raj Patel" }).click();
      await expect(page.getByRole("heading", { level: 1, name: "Mr Raj Patel" })).toBeVisible();
    });
  });
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/news", heading: "News" },
  { path: "/news/science-centre-wins-design-award", heading: "Science & Innovation Centre wins regional design award" },
  { path: "/notices", heading: "Notices" },
  { path: "/notices/term-dates-2026-27", heading: "Term dates for 2026-27" },
  { path: "/events", heading: "Events" },
  { path: "/events?view=calendar&month=2026-12", heading: "Events" },
  { path: "/events/whole-school-open-morning-october-2026", heading: "Whole-School Open Morning" },
];

test.describe("news, notices and events pages", () => {
  // Scroll-reveal content starts at opacity 0, which axe would report as low contrast.
  test.use({ reducedMotion: "reduce" });

  for (const { path, heading } of PAGES) {
    test(`${path} renders and has no detectable accessibility violations`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      // Wait for streamed results before scanning.
      await expect(page.locator(".results-skeleton")).toHaveCount(0);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations, results.violations.map((v) => v.id).join(", ")).toEqual([]);
    });
  }

  test("unknown article, notice and event slugs return 404", async ({ page }) => {
    for (const [path, heading] of [
      ["/news/no-such-article", "Article not found"],
      ["/notices/no-such-notice", "Notice not found"],
      ["/events/no-such-event", "Event not found"],
    ] as const) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    }
  });
});

test.describe("news", () => {
  test("shows top stories only on the plain first page", async ({ page }) => {
    await page.goto("/news");
    await expect(page.getByRole("heading", { name: "Top stories" })).toBeAttached();
    await page.getByRole("navigation", { name: "News categories" }).getByRole("link", { name: "Sports" }).click();
    await expect(page).toHaveURL(/\/news\?category=sports$/);
    await expect(page.getByRole("heading", { name: "Top stories" })).not.toBeAttached();
    await expect(page.getByRole("status").filter({ hasText: "Showing" })).toContainText("in Sports");
  });

  test("searches and paginates", async ({ page }) => {
    await page.goto("/news");
    await page.getByRole("link", { name: "Page 2" }).click();
    await expect(page).toHaveURL(/\/news\?page=2$/);
    await expect(page.getByText("Showing 10-16 of 16 articles")).toBeVisible();

    await page.getByRole("searchbox", { name: "Search news" }).fill("robotics");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/news\?q=robotics$/);
    await page.getByRole("link", { name: "Robotics team qualifies for the national final" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Robotics team qualifies for the national final" }),
    ).toBeVisible();
  });

  test("articles have a table of contents that links to sections", async ({ page }) => {
    await page.goto("/news/robotics-team-qualifies-for-national-final");
    const contents = page.getByRole("navigation", { name: "Contents" });
    await contents.getByRole("link", { name: "The engineering" }).click();
    await expect(page).toHaveURL(/#the-engineering$/);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("lists the latest articles instead of the streamed list", async ({ page }) => {
      await page.goto("/news");
      await expect(page.getByRole("heading", { name: "Latest news" })).toBeVisible();
      await page.getByRole("link", { name: "Year 11 celebrate record GCSE results" }).click();
      await expect(
        page.getByRole("heading", { level: 1, name: "Year 11 celebrate record GCSE results" }),
      ).toBeVisible();
    });
  });
});

test.describe("notices", () => {
  test("lists important notices first and filters by category", async ({ page }) => {
    await page.goto("/notices");
    await expect(page.locator(".notice-row").first()).toContainText("Important");
    await page
      .getByRole("complementary", { name: "Filter notices" })
      .getByRole("link", { name: "Examinations" })
      .click();
    await expect(page).toHaveURL(/\/notices\?category=exams$/);
    await expect(page.getByText(/Showing 1-2 of 2 notices in Examinations/)).toBeVisible();
  });

  test("searches and paginates", async ({ page }) => {
    await page.goto("/notices");
    // 10 notices, 8 per page.
    await page.getByRole("link", { name: "Page 2" }).click();
    await expect(page).toHaveURL(/\/notices\?page=2$/);
    await expect(page.locator(".notice-row")).toHaveCount(2);

    await page.getByRole("searchbox", { name: "Search notices" }).fill("photographs");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/notices\?q=photographs$/);
    await expect(page.locator(".notice-row")).toHaveCount(1);
    await expect(page.locator(".notice-row")).toContainText("School photographs");
  });
});

test.describe("hand-edited URLs", () => {
  // Invalid filter values are ignored (lenient parsing), so the page shows the unfiltered list.
  for (const path of [
    "/news?category=gossip&page=abc",
    "/notices?category=nope&page=-1",
    "/events?month=2026-13&view=table&category=x",
    "/faculty?department=%3Cscript%3E&page=99999",
  ]) {
    test(`${path} still renders`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator(".results-skeleton")).toHaveCount(0);
    });
  }
});

test.describe("events", () => {
  test("filters the list by month and category with the form", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByRole("heading", { name: "Upcoming events" })).toBeVisible();
    await page.getByLabel("Month").selectOption("2026-12");
    await page.getByLabel("Category").selectOption("arts");
    await page.getByRole("button", { name: "Show events" }).click();
    await expect(page).toHaveURL(/\/events\?month=2026-12&category=arts$/);
    await expect(page.getByRole("heading", { level: 2, name: "December 2026" })).toBeVisible();
    await expect(page.locator(".event-row")).toHaveCount(1);
    await expect(page.locator(".event-row")).toContainText("Carol Service");
  });

  test("shows a month calendar with links and month navigation", async ({ page }) => {
    await page.goto("/events?view=calendar&month=2026-12");
    await expect(page.getByRole("link", { name: "Calendar" })).toHaveAttribute("aria-current", "page");
    const calendar = page.getByRole("table", { name: "Events in December 2026" });
    await expect(calendar.getByRole("link", { name: "Christmas Fair" })).toBeVisible();

    await page.getByRole("link", { name: "Next month, January 2027" }).click();
    await expect(page).toHaveURL(/month=2027-01/);
    await expect(page.getByRole("table", { name: "Events in January 2027" })).toBeVisible();
    // The two-week mock exams appear on every school day they run.
    await expect(page.getByRole("link", { name: "Year 13 Mock Examinations" })).toHaveCount(12);
  });

  test("event pages offer an .ics download", async ({ page, request }) => {
    await page.goto("/events/carol-service-2026");
    const link = page.getByRole("link", { name: "Add to Calendar" });
    await expect(link).toHaveAttribute("href", "/events/carol-service-2026/calendar.ics");

    const response = await request.get("/events/carol-service-2026/calendar.ics");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/calendar");
    expect(await response.text()).toContain("SUMMARY:Carol Service");
  });
});

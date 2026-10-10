import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/admissions", heading: "Admissions" },
  { path: "/campus", heading: "Campus & Facilities" },
  { path: "/student-life", heading: "Student Life" },
  { path: "/alumni", heading: "Alumni" },
  { path: "/careers", heading: "Careers" },
  { path: "/careers/teacher-of-physics-2027", heading: "Teacher of Physics" },
  { path: "/faq", heading: "Frequently Asked Questions" },
  { path: "/gallery", heading: "Gallery" },
  { path: "/gallery/sports-day-2026", heading: "Sports Day 2026" },
  { path: "/privacy", heading: "Privacy Policy" },
  { path: "/terms", heading: "Terms of Service" },
  { path: "/contact", heading: "Contact" },
];

test.describe("admissions, campus, student life, alumni, careers, FAQ, gallery and legal pages", () => {
  // Scroll-reveal content starts at opacity 0, which axe would report as low contrast.
  test.use({ reducedMotion: "reduce" });

  for (const { path, heading } of PAGES) {
    test(`${path} renders and has no detectable accessibility violations`, async ({ page }) => {
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

  test("unknown album and vacancy slugs return 404", async ({ page }) => {
    for (const [path, heading] of [
      ["/gallery/no-such-album", "Album not found"],
      ["/careers/no-such-vacancy", "Vacancy not found"],
    ] as const) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    }
  });
});

test.describe("gallery", () => {
  test("opens photos in a lightbox, moves with the arrow keys and closes with Escape", async ({ page }) => {
    await page.goto("/gallery");
    await page.getByRole("link", { name: "Sports Day 2026" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Sports Day 2026" })).toBeVisible();

    const tile = page.getByRole("link", { name: "Pupils sprinting on the athletics track" });
    await tile.click();
    const dialog = page.getByRole("dialog", { name: "Sports Day 2026" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Year 9 100 metres final");
    await expect(dialog).toContainText("Photo 1 of 7");

    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("Photo 2 of 7");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText("Photo 7 of 7");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    // Focus returns to the tile of the photo shown last.
    await expect(page.getByRole("link", { name: "Parents watching from the spectator area" })).toBeFocused();
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("tiles link to the full-size images", async ({ page }) => {
      await page.goto("/gallery/sports-day-2026");
      await expect(page.getByRole("link", { name: "Pupils sprinting on the athletics track" })).toHaveAttribute(
        "href",
        /^https:\/\/placehold\.co\/1400x1000\//,
      );
    });
  });
});

test.describe("campus and student life", () => {
  test("facility tabs show a slideshow with working controls", async ({ page }) => {
    await page.goto("/campus");
    await page.getByRole("tab", { name: "Sport" }).click();
    const carousel = page.getByRole("region", { name: "Sport photos" });
    await expect(carousel.getByRole("img", { name: "The sports hall set up for a basketball match" })).toBeVisible();
    await carousel.getByRole("button", { name: "Next slide" }).click();
    await expect(carousel.getByRole("img", { name: "Pupils racing in the 25-metre swimming pool" })).toBeVisible();
    await expect(carousel.getByRole("img", { name: "The sports hall set up for a basketball match" })).toBeHidden();
  });

  test("the campus gallery links to the full album", async ({ page }) => {
    await page.goto("/campus");
    await page.getByRole("link", { name: "See all 8 photos" }).click();
    await expect(page).toHaveURL(/\/gallery\/campus-and-grounds$/);
  });
});

test.describe("admissions and FAQ", () => {
  test("lists fees and downloadable forms", async ({ page, request }) => {
    await page.goto("/admissions");
    await expect(page.getByRole("row", { name: /Sixth Form Years 12 and 13 £7,250/ })).toBeVisible();

    const form = page.getByRole("link", { name: /^Application Form.*PDF/ });
    await expect(form).toHaveAttribute("href", "/documents/admissions-application-form-2027.pdf");
    const response = await request.get("/documents/admissions-application-form-2027.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });

  test("questions open and close, and topics link to their section", async ({ page }) => {
    await page.goto("/faq");
    const question = page.getByText("Is there a school bus?");
    const answer = page.getByText(/Six bus routes cover/);
    await expect(answer).toBeHidden();
    await question.click();
    await expect(answer).toBeVisible();
    await question.click();
    await expect(answer).toBeHidden();

    await page
      .getByRole("navigation", { name: "Topics" })
      .getByRole("link", { name: /Getting to School/ })
      .click();
    await expect(page).toHaveURL(/\/faq#transport$/);
  });
});

test.describe("careers and alumni", () => {
  test("shows open vacancies, and a closed note on a closed vacancy's page", async ({ page }) => {
    await page.goto("/careers");
    await expect(page.getByRole("link", { name: "Teacher of Physics" })).toBeVisible();
    // Closed on 25 September 2026, so it is no longer listed...
    await expect(page.getByRole("link", { name: "School Receptionist" })).toHaveCount(0);

    // ...but its page still works for old links.
    await page.goto("/careers/school-receptionist-2026");
    await expect(page.getByRole("heading", { name: "Applications Closed" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How to Apply" })).toHaveCount(0);
  });

  test("alumni events link to their event pages", async ({ page }) => {
    await page.goto("/alumni");
    await page.getByRole("link", { name: /RSVP.*Alumni Reunion Day/ }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Alumni Reunion Day" })).toBeVisible();
  });
});

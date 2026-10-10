import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// The e2e server runs with FORM_MIN_FILL_MS=0 and a high FORM_RATE_LIMIT (playwright.config.ts),
// because tests fill forms in milliseconds and submit many times. Both checks have unit tests.

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations, results.violations.map((v) => v.id).join(", ")).toEqual([]);
}

test.describe("contact form", () => {
  test.use({ reducedMotion: "reduce" });

  test("shows accessible errors, keeps the input, then sends", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Send Message" }) });
    await form.getByLabel("Your name").fill("Ada Lovelace");
    await form.getByLabel("Email address").fill("ada@");
    await form.getByRole("button", { name: "Send Message" }).click();

    // The error summary is focused and links to each problem.
    const summary = page.getByRole("heading", { name: "Please correct the errors below." });
    await expect(summary).toBeVisible();
    await expect(page.locator(".form-alert")).toBeFocused();
    // Scrolled into view below the fixed header, not underneath it.
    const header = await page.locator("header").first().boundingBox();
    const alert = await page.locator(".form-alert").boundingBox();
    expect(alert && header && alert.y >= header.y + header.height).toBe(true);
    await expect(page.getByRole("link", { name: /Enter an email address in the correct format/ })).toBeVisible();
    await expect(form.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");
    await expect(form.getByLabel("Your name")).toHaveValue("Ada Lovelace");
    await expectNoAxeViolations(page);

    await form.getByLabel("Email address").fill("ada@example.com");
    await form.getByLabel("Topic").selectOption("admissions");
    await form.getByLabel("Message").fill("Could we visit next week?");
    await form.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Thank you for your message" })).toBeFocused();
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("still validates and sends (progressive enhancement)", async ({ page }) => {
      await page.goto("/contact");
      const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Send Message" }) });
      await form.getByLabel("Your name").fill("Ada Lovelace");
      await form.getByRole("button", { name: "Send Message" }).click();
      await expect(page.getByRole("heading", { name: "Please correct the errors below." })).toBeVisible();
      await expect(form.getByLabel("Your name")).toHaveValue("Ada Lovelace");

      await form.getByLabel("Email address").fill("ada@example.com");
      await form.getByLabel("Topic").selectOption("general");
      await form.getByLabel("Message").fill("Hello from a browser without JavaScript.");
      await form.getByRole("button", { name: "Send Message" }).click();
      await expect(page.getByText("Thank you for your message")).toBeVisible();
    });
  });
});

test.describe("admissions enquiry", () => {
  test("sends an enquiry with options ticked", async ({ page }) => {
    await page.goto("/admissions");
    const form = page.locator("#enquire form");
    await form.getByLabel("Your name").fill("Grace Hopper");
    await form.getByLabel("Email address").fill("grace@example.com");
    await form.getByLabel("Child's name").fill("Alan Hopper");
    await form.getByLabel("Year group they would join").selectOption("year-7");
    await form.getByLabel("When would they start?").selectOption("next-september");
    await form.getByLabel("Post me a printed prospectus").check();
    await form.getByRole("button", { name: "Submit Request" }).click();
    await expect(page.getByText(/Thank you for your enquiry/)).toBeVisible();
  });

  test("lists every missing answer and keeps ticked options", async ({ page }) => {
    await page.goto("/admissions");
    const form = page.locator("#enquire form");
    await form.getByLabel("Post me a printed prospectus").check();
    await form.getByRole("button", { name: "Submit Request" }).click();

    const summary = page.locator(".form-alert");
    await expect(summary).toBeFocused();
    for (const message of [
      "Enter your full name.",
      /Enter an email address/,
      "Enter your child's full name.",
      "Choose the year group your child would join.",
      "Choose when your child would like to start.",
    ]) {
      await expect(summary.getByRole("link", { name: message })).toBeVisible();
    }
    await expect(form.getByLabel("Year group they would join")).toHaveAttribute("aria-invalid", "true");
    await expect(form.getByLabel("Post me a printed prospectus")).toBeChecked();
  });
});

test.describe("newsletter", () => {
  test("validates the address and confirms the subscription", async ({ page }) => {
    await page.goto("/about");
    const footer = page.getByRole("contentinfo");
    await footer.getByLabel("Email address").fill("not-an-email");
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByText(/Enter an email address in the correct format/)).toBeVisible();
    await expect(footer.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");

    await footer.getByLabel("Email address").fill("reader@example.com");
    await footer.getByRole("button", { name: "Subscribe" }).click();
    await expect(footer.getByText(/check your inbox/)).toBeVisible();
  });
});

test.describe("event booking", () => {
  test("books places for an event", async ({ page }) => {
    await page.goto("/events/alumni-careers-evening-2026");
    const form = page.locator(".booking-panel form");
    await form.getByLabel("Your name").fill("Ada Lovelace");
    await form.getByLabel("Email address").fill("ada@example.com");
    await form.getByLabel("Number of places").selectOption("2");
    await form.getByRole("button", { name: "Book Places" }).click();
    await expect(page.getByText(/Your places at Alumni Careers Evening are booked/)).toBeVisible();
  });

  test("explains when there aren't enough places left", async ({ page }) => {
    // 38 of the 40 places are taken in the mock API.
    await page.goto("/events/alumni-mentoring-breakfast-2027");
    const form = page.locator(".booking-panel form");
    await form.getByLabel("Your name").fill("Ada Lovelace");
    await form.getByLabel("Email address").fill("ada@example.com");
    await form.getByLabel("Number of places").selectOption("5");
    await form.getByRole("button", { name: "Book Places" }).click();
    await expect(form.getByText("Only 2 places are left.").first()).toBeVisible();
    await expect(form.getByLabel("Number of places")).toHaveAttribute("aria-invalid", "true");
  });

  test("hides the form once booking has closed", async ({ page }) => {
    await page.goto("/events/sixth-form-open-evening-2026");
    await expect(page.getByText("Booking for this event has closed.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Book Places" })).toHaveCount(0);
  });
});

import { expect, test } from "@playwright/test";

test.describe("main navigation", () => {
  test("dropdown opens with the keyboard and closes with Escape", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop dropdown behaviour");
    await page.goto("/");
    const about = page.getByRole("button", { name: "About" });
    await about.focus();
    await page.keyboard.press("Enter");
    await expect(about).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Admissions" }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(about).toHaveAttribute("aria-expanded", "false");
    await expect(about).toBeFocused();
  });

  test("mobile menu opens and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile menu behaviour");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contact" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });
});

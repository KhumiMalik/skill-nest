import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;

/**
 * End-to-end tests run against a production build (`npm run build` first),
 * so they exercise the same caching and rendering as the deployed site.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: baseURL,
    // Always start a fresh server with the env below. Reusing one started by hand (without these
    // settings) made the form tests fail with "That was quick!" spam errors.
    reuseExistingServer: false,
    // Tests submit forms within milliseconds and many times in a row; production keeps the defaults.
    env: {
      FORM_MIN_FILL_MS: "0",
      FORM_RATE_LIMIT: "1000",
      REVALIDATE_SECRET: "e2e-revalidate-secret-0123456789abcdef",
    },
    timeout: 120_000,
  },
});

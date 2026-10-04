import { cacheLife, cacheTag } from "next/cache";
import { apiRequest, mockApi } from "@/lib/api";
import { aboutPageSchema, homePageSchema, programsPageSchema } from "./schemas";

// Page copy changes rarely, and the backend revalidates the `pages:{key}` tag when an editor
// saves (Phase 7), so a long lifetime is safe. "days" is a safety net if a webhook is missed.

export async function getHomePage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:home");
  return apiRequest({
    method: "GET",
    path: "/pages/home",
    schema: homePageSchema,
    mock: () => mockApi.pages.get("home"),
  });
}

export async function getAboutPage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:about");
  return apiRequest({
    method: "GET",
    path: "/pages/about",
    schema: aboutPageSchema,
    mock: () => mockApi.pages.get("about"),
  });
}

export async function getProgramsPage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:programs");
  return apiRequest({
    method: "GET",
    path: "/pages/programs",
    schema: programsPageSchema,
    mock: () => mockApi.pages.get("programs"),
  });
}

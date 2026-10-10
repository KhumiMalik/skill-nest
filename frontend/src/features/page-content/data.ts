import { cacheLife, cacheTag } from "next/cache";
import type { z } from "zod";
import { apiRequest, mockApi } from "@/lib/api";
import {
  aboutPageSchema,
  admissionsPageSchema,
  alumniPageSchema,
  campusPageSchema,
  careersPageSchema,
  homePageSchema,
  legalPageSchema,
  programsPageSchema,
  studentLifePageSchema,
} from "./schemas";
import type { LegalPageKey } from "./types";

// Page copy changes rarely, and the backend revalidates the `pages:{key}` tag when an editor
// saves (Phase 7), so a long lifetime is safe. "days" is a safety net if a webhook is missed.
// Each page has its own small cached function: the schema can't be an argument of a cached
// function (arguments must be serialisable, because they become part of the cache key).

/** GET /pages/{key}, validated with the page's schema. Called inside the cached functions below. */
function requestPage<T extends z.ZodType>(key: string, schema: T): Promise<z.infer<T>> {
  return apiRequest({ method: "GET", path: `/pages/${key}`, schema, mock: () => mockApi.pages.get(key) });
}

export async function getHomePage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:home");
  return requestPage("home", homePageSchema);
}

export async function getAboutPage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:about");
  return requestPage("about", aboutPageSchema);
}

export async function getProgramsPage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:programs");
  return requestPage("programs", programsPageSchema);
}

export async function getAdmissionsPage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:admissions");
  return requestPage("admissions", admissionsPageSchema);
}

export async function getCampusPage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:campus");
  return requestPage("campus", campusPageSchema);
}

export async function getStudentLifePage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:student-life");
  return requestPage("student-life", studentLifePageSchema);
}

export async function getAlumniPage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:alumni");
  return requestPage("alumni", alumniPageSchema);
}

export async function getCareersPage() {
  "use cache";
  cacheLife("days");
  cacheTag("pages:careers");
  return requestPage("careers", careersPageSchema);
}

/** The privacy policy or the terms of use. */
export async function getLegalPage(key: LegalPageKey) {
  "use cache";
  cacheLife("days");
  cacheTag(`pages:${key}`);
  return requestPage(key, legalPageSchema);
}

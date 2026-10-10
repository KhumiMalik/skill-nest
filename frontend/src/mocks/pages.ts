import { ApiError } from "@/lib/api/errors";
import { aboutPage } from "./data/pages/about";
import { admissionsPage } from "./data/pages/admissions";
import { alumniPage } from "./data/pages/alumni";
import { campusPage } from "./data/pages/campus";
import { careersPage } from "./data/pages/careers";
import { homePage } from "./data/pages/home";
import { privacyPage, termsPage } from "./data/pages/legal";
import { programsPage } from "./data/pages/programs";
import { studentLifePage } from "./data/pages/student-life";

const pages = {
  home: homePage,
  about: aboutPage,
  programs: programsPage,
  admissions: admissionsPage,
  campus: campusPage,
  "student-life": studentLifePage,
  alumni: alumniPage,
  careers: careersPage,
  privacy: privacyPage,
  terms: termsPage,
};

/** Replaces `GET /api/v1/pages/{key}` */
export function getPage(key: string) {
  if (!Object.hasOwn(pages, key)) throw new ApiError(404, { message: "Page not found." });
  return pages[key as keyof typeof pages];
}

import type { z } from "zod";
import type {
  aboutPageSchema,
  admissionsPageSchema,
  alumniPageSchema,
  campusPageSchema,
  careersPageSchema,
  ctaSchema,
  homePageSchema,
  iconCardSchema,
  introSchema,
  legalPageSchema,
  linkCardSchema,
  linkSchema,
  programsPageSchema,
  statSchema,
  stepSchema,
  studentLifePageSchema,
  testimonialSchema,
} from "./schemas";

export type Stat = z.infer<typeof statSchema>;
export type IconCard = z.infer<typeof iconCardSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type LinkCard = z.infer<typeof linkCardSchema>;
export type Link = z.infer<typeof linkSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type PageIntro = z.infer<typeof introSchema>;
export type Step = z.infer<typeof stepSchema>;
export type HomePage = z.infer<typeof homePageSchema>;
export type AboutPage = z.infer<typeof aboutPageSchema>;
export type ProgramsPage = z.infer<typeof programsPageSchema>;
export type AdmissionsPage = z.infer<typeof admissionsPageSchema>;
export type CampusPage = z.infer<typeof campusPageSchema>;
export type StudentLifePage = z.infer<typeof studentLifePageSchema>;
export type AlumniPage = z.infer<typeof alumniPageSchema>;
export type CareersPage = z.infer<typeof careersPageSchema>;
export type LegalPage = z.infer<typeof legalPageSchema>;
export type LegalPageKey = "privacy" | "terms";

import type { z } from "zod";
import type {
  aboutPageSchema,
  homePageSchema,
  iconCardSchema,
  linkCardSchema,
  programsPageSchema,
  statSchema,
  testimonialSchema,
} from "./schemas";

export type Stat = z.infer<typeof statSchema>;
export type IconCard = z.infer<typeof iconCardSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type LinkCard = z.infer<typeof linkCardSchema>;
export type HomePage = z.infer<typeof homePageSchema>;
export type AboutPage = z.infer<typeof aboutPageSchema>;
export type ProgramsPage = z.infer<typeof programsPageSchema>;

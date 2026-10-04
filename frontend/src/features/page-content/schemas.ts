import { z } from "zod";
import { imageSchema, slugSchema } from "@/lib/api/schemas";

// Editable copy for the pages that are mostly marketing content (home, about, programs).
// Served by GET /api/v1/pages/{key}; each key has its own shape below.

/**
 * A Bootstrap Icons name chosen by the content editor, e.g. "trophy".
 * The frontend ships a subset of icons and falls back to a default for unknown names.
 */
const iconNameSchema = z.string().min(1);

/** A headline number such as "1,240 pupils" or "11:1 pupil-teacher ratio". */
export const statSchema = z.object({
  value: z.number().int().nonnegative(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string(),
  icon: iconNameSchema.optional(),
});

/** A short titled paragraph with an icon (mission, values, student-life highlights...). */
export const iconCardSchema = z.object({
  icon: iconNameSchema,
  title: z.string(),
  text: z.string(),
});

export const testimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  role: z.string(),
  photo: imageSchema,
});

/** An image card linking to another page of the site. */
export const linkCardSchema = z.object({
  title: z.string(),
  text: z.string(),
  /** Site-relative path, e.g. "/campus". */
  href: z.string().startsWith("/"),
  image: imageSchema,
});

export const homePageSchema = z.object({
  hero: z.object({ title: z.string(), lead: z.string(), image: imageSchema }),
  /** "Why choose us" figures shown in the hero. */
  highlights: z.array(statSchema),
  welcome: z.object({
    title: z.string(),
    /** Second part of the title, shown in the brand colour. */
    titleHighlight: z.string(),
    lead: z.string(),
    stats: z.array(statSchema),
    images: z.tuple([imageSchema, imageSchema]),
    signature: z.object({ name: z.string(), role: z.string() }),
  }),
  /** Mission, vision and values cards. */
  pillars: z.array(iconCardSchema),
  studentLife: z.object({
    feature: z.object({ title: z.string(), image: imageSchema }),
    cards: z.array(iconCardSchema),
  }),
  testimonials: z.array(testimonialSchema),
  achievements: z.object({
    title: z.string(),
    text: z.string(),
    stats: z.array(statSchema),
    links: z.array(linkCardSchema),
  }),
});

export const aboutPageSchema = z.object({
  history: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()).min(1),
    stats: z.array(statSchema),
    image: imageSchema,
  }),
  mission: z.string(),
  vision: z.string(),
  values: z.array(iconCardSchema),
  milestones: z.object({
    title: z.string(),
    text: z.string(),
    entries: z.array(z.object({ year: z.number().int(), title: z.string(), text: z.string() })),
  }),
  headMessage: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()).min(1),
    name: z.string(),
    role: z.string(),
    photo: imageSchema,
  }),
});

export const programsPageSchema = z.object({
  intro: z.object({ eyebrow: z.string(), title: z.string(), paragraphs: z.array(z.string()).min(1) }),
  stats: z.array(statSchema),
  /** One program highlighted at the bottom of the programs page. */
  spotlight: z.object({
    programSlug: slugSchema,
    eyebrow: z.string(),
    title: z.string(),
    text: z.string(),
    image: imageSchema,
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
  }),
});

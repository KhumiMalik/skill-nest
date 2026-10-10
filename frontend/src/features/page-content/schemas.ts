import { z } from "zod";
import {
  contentBlockSchema,
  fileSchema,
  imageSchema,
  linkHrefSchema,
  photoSchema,
  sitePathSchema,
  slugSchema,
} from "@/lib/api/schemas";

// Editable copy for the pages that are mostly marketing content (home, about, programs, admissions...).
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
  href: sitePathSchema,
  image: imageSchema,
});

/** A text link, e.g. { label: "Join the network", href: "/contact" }. `href` may also be a URL or `mailto:`. */
export const linkSchema = z.object({ label: z.string(), href: linkHrefSchema });

/** The green call-to-action band. */
export const ctaSchema = z.object({ title: z.string(), text: z.string(), link: linkSchema });

/** A numbered step, e.g. in the admissions process. */
export const stepSchema = z.object({ title: z.string(), text: z.string() });

/** Opening section of an inner page: text on one side, figures (and sometimes an image) on the other. */
export const introSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  paragraphs: z.array(z.string()).min(1),
  stats: z.array(statSchema),
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

export const admissionsPageSchema = z.object({
  intro: z.object({
    eyebrow: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string()).min(1),
    points: z.array(z.string()),
    image: imageSchema,
  }),
  steps: z.array(stepSchema).min(1),
  requirements: z.array(iconCardSchema),
  deadlines: z.object({
    title: z.string(),
    entries: z.array(z.object({ title: z.string(), text: z.string(), date: z.iso.date() })),
  }),
  fees: z.object({
    title: z.string(),
    /** One row per stage. Amounts are whole pounds per term. */
    rows: z.array(z.object({ stage: z.string(), years: z.string(), termFee: z.number().int().positive() })).min(1),
    notes: z.array(z.string()),
  }),
  /** Application forms, fee schedules... */
  documents: z.array(fileSchema),
  visit: z.object({ title: z.string(), text: z.string() }),
  apply: ctaSchema,
});

export const campusPageSchema = z.object({
  intro: introSchema,
  /** One tab per group (academic, sport...), each with a slideshow and a few facilities. */
  facilityGroups: z
    .array(
      z.object({
        id: slugSchema,
        label: z.string(),
        images: z.array(imageSchema).min(1),
        facilities: z.array(iconCardSchema).min(1),
      }),
    )
    .min(1),
  map: z.object({
    title: z.string(),
    text: z.string(),
    /** Site plan with numbered buildings; `key` lists them in number order. */
    image: imageSchema,
    key: z.array(z.object({ name: z.string(), text: z.string() })),
  }),
  /** Gallery album previewed at the bottom of the page. */
  galleryAlbum: slugSchema,
});

export const studentLifePageSchema = z.object({
  intro: introSchema,
  highlights: z.array(iconCardSchema),
  /** One tab per area (clubs, arts...). */
  activities: z
    .array(
      z.object({
        id: slugSchema,
        label: z.string(),
        title: z.string(),
        text: z.string(),
        points: z.array(z.string()),
        image: imageSchema,
      }),
    )
    .min(1),
  teams: z.array(
    z.object({
      name: z.string(),
      text: z.string(),
      image: imageSchema,
      /** e.g. "3 county titles". */
      honours: z.string(),
      members: z.number().int().nonnegative(),
    }),
  ),
  facilities: z.object({ title: z.string(), cards: z.array(iconCardSchema), photos: z.array(photoSchema) }),
  support: z.array(iconCardSchema),
  cta: ctaSchema,
});

export const alumniPageSchema = z.object({
  intro: introSchema.extend({ image: imageSchema }),
  /** Ways to stay in touch, each with a link. */
  connect: z.array(iconCardSchema.extend({ link: linkSchema })),
  spotlights: z.array(
    z.object({
      name: z.string(),
      classOf: z.number().int(),
      role: z.string(),
      story: z.string(),
      photo: imageSchema,
    }),
  ),
  giving: ctaSchema,
});

export const careersPageSchema = z.object({
  intro: z.object({
    eyebrow: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string()).min(1),
    image: imageSchema,
  }),
  benefits: z.array(iconCardSchema),
  process: z.array(stepSchema),
  /** Safer recruitment statement, required on every UK school vacancy page. */
  safeguarding: z.string(),
});

/** GET /pages/privacy and GET /pages/terms. */
export const legalPageSchema = z.object({
  /** Shown under the page title. */
  summary: z.string(),
  updatedOn: z.iso.date(),
  body: z.array(contentBlockSchema).min(1),
});

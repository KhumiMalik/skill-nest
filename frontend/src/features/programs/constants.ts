// Plain values shared by schemas.ts and Client Components. No Zod here: anything a Client Component
// imports ends up in the browser bundle, and Zod would add about 90 KB to it.

/** School stages, in the order pupils move through them. */
export const PROGRAM_LEVELS = ["early-years", "primary", "secondary", "sixth-form"] as const;

export const PROGRAM_LEVEL_LABELS: Record<(typeof PROGRAM_LEVELS)[number], string> = {
  "early-years": "Early Years",
  primary: "Primary",
  secondary: "Secondary",
  "sixth-form": "Sixth Form",
};

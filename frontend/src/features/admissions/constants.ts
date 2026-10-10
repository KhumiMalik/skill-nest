// Plain values shared by schemas.ts and the (client) enquiry form. No Zod here: anything a Client
// Component imports ends up in the browser bundle, and Zod would add about 90 KB to it.

export const YEAR_GROUP_LABELS = {
  nursery: "Nursery",
  reception: "Reception",
  "year-1": "Year 1",
  "year-2": "Year 2",
  "year-3": "Year 3",
  "year-4": "Year 4",
  "year-5": "Year 5",
  "year-6": "Year 6",
  "year-7": "Year 7",
  "year-8": "Year 8",
  "year-9": "Year 9",
  "year-10": "Year 10",
  "year-11": "Year 11",
  "year-12": "Year 12 (Sixth Form)",
  "year-13": "Year 13 (Sixth Form)",
} as const;

type YearGroup = keyof typeof YEAR_GROUP_LABELS;
/** Object.keys keeps the order above; the cast tells TypeScript the keys are exactly these. */
export const YEAR_GROUPS = Object.keys(YEAR_GROUP_LABELS) as [YearGroup, ...YearGroup[]];

/** When the family would like their child to start. Relative, so the options never go out of date. */
export const START_OPTIONS = ["as-soon-as-possible", "next-september", "following-september"] as const;

export const START_OPTION_LABELS: Record<(typeof START_OPTIONS)[number], string> = {
  "as-soon-as-possible": "As soon as possible",
  "next-september": "Next September",
  "following-september": "The September after next",
};

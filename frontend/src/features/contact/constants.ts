// Plain values shared by schemas.ts and the (client) contact form. No Zod here: anything a Client
// Component imports ends up in the browser bundle, and Zod would add about 90 KB to it.

export const CONTACT_TOPICS = ["general", "admissions", "fees", "events", "alumni", "careers"] as const;

export const CONTACT_TOPIC_LABELS: Record<(typeof CONTACT_TOPICS)[number], string> = {
  general: "General enquiry",
  admissions: "Admissions",
  fees: "Fees and payments",
  events: "Events and bookings",
  alumni: "Alumni",
  careers: "Jobs and careers",
};

import { admissionEnquirySchema } from "@/features/admissions/schemas";
import { contactMessageSchema } from "@/features/contact/schemas";
import { newsletterSubscriptionSchema } from "@/features/newsletter/schemas";
import { validationError } from "@/lib/api/errors";
import type { Created } from "@/lib/api/schemas";
import type { z } from "zod";

/**
 * Submissions received by the mock API, newest last. Kept in memory (lost on restart) so tests and
 * developers can see what a form sent; the real backend stores them and sends emails.
 */
export const mockOutbox: { endpoint: string; body: unknown; receivedAt: string }[] = [];

/** Validates a POST body like the backend (422 with field errors) and records it. */
function receive<T extends z.ZodType>(endpoint: string, schema: T, body: unknown, message: string): Created {
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw validationError(parsed.error);
  mockOutbox.push({ endpoint, body: parsed.data, receivedAt: new Date().toISOString() });
  return { id: crypto.randomUUID(), message };
}

/** Replaces `POST /api/v1/contact-messages` */
export function createContactMessage(body: unknown): Created {
  return receive("POST /contact-messages", contactMessageSchema, body, "Message received.");
}

/** Replaces `POST /api/v1/admission-enquiries` */
export function createAdmissionEnquiry(body: unknown): Created {
  return receive("POST /admission-enquiries", admissionEnquirySchema, body, "Enquiry received.");
}

/**
 * Replaces `POST /api/v1/newsletter-subscriptions`. Answers 201 even for addresses already on the
 * list, so the endpoint can't reveal who is subscribed; the backend then sends a confirmation email.
 */
export function createNewsletterSubscription(body: unknown): Created {
  return receive("POST /newsletter-subscriptions", newsletterSubscriptionSchema, body, "Please confirm by email.");
}

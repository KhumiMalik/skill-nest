"use server";

import { apiRequest, createdSchema, mockApi } from "@/lib/api";
import { readValues, submitForm } from "@/lib/forms/server";
import type { FormState } from "@/lib/forms/types";
import { getEvent } from "./data";
import { eventRegistrationSchema } from "./schemas";

/**
 * Event booking form. The form only sends the event's slug; whether booking is open is read again
 * from the API here (a POST can come from anywhere, not only from our page).
 */
export async function registerForEvent(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = readValues(formData, ["event", "name", "email", "phone", "places", "notes"]);

  const event = await getEvent(values.event);
  if (!event?.registration) {
    return { status: "error", message: "Online booking is not available for this event.", values };
  }
  // The page hides the form once the deadline has passed, but it is cached for up to an hour: check exactly.
  if (new Date(event.registration.deadline).getTime() <= Date.now()) {
    return { status: "error", message: "Sorry, booking for this event has closed.", values };
  }

  return submitForm({
    form: "event-registration",
    formData,
    values,
    body: {
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      places: Number(values.places),
      notes: values.notes || undefined,
    },
    schema: eventRegistrationSchema,
    send: (body) =>
      apiRequest({
        method: "POST",
        path: `/events/${encodeURIComponent(event.slug)}/registrations`,
        body,
        schema: createdSchema,
        mock: () => mockApi.events.register(event.slug, body),
      }),
    successMessage: `Thank you! Your places at ${event.title} are booked. We have emailed you a confirmation.`,
  });
}

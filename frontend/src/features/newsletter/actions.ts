"use server";

import { apiRequest, createdSchema, mockApi } from "@/lib/api";
import { readValues, submitForm } from "@/lib/forms/server";
import type { FormState } from "@/lib/forms/types";
import { newsletterSubscriptionSchema } from "./schemas";

/** Newsletter sign-up in the footer. */
export async function subscribeToNewsletter(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = readValues(formData, ["email"]);

  return submitForm({
    form: "newsletter",
    formData,
    values,
    body: values,
    schema: newsletterSubscriptionSchema,
    send: (body) =>
      apiRequest({
        method: "POST",
        path: "/newsletter-subscriptions",
        body,
        schema: createdSchema,
        mock: () => mockApi.forms.newsletterSubscription(body),
      }),
    // The same answer whether or not the address was already subscribed, so the form can't be
    // used to find out who is on the list. The backend sends a confirmation email (double opt-in).
    successMessage: "Thank you! Please check your inbox and click the link to confirm your subscription.",
  });
}

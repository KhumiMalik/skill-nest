"use server";

import { apiRequest, createdSchema, mockApi } from "@/lib/api";
import { readValues, submitForm } from "@/lib/forms/server";
import type { FormState } from "@/lib/forms/types";
import { contactMessageSchema } from "./schemas";

/** Contact form. Every server action is a public POST endpoint, so everything is validated here. */
export async function sendContactMessage(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = readValues(formData, ["name", "email", "phone", "topic", "message"]);

  return submitForm({
    form: "contact",
    formData,
    values,
    body: { ...values, phone: values.phone || undefined },
    schema: contactMessageSchema,
    send: (body) =>
      apiRequest({
        method: "POST",
        path: "/contact-messages",
        body,
        schema: createdSchema,
        mock: () => mockApi.forms.contactMessage(body),
      }),
    successMessage: "Thank you for your message. We will reply within one working day.",
  });
}

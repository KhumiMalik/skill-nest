"use server";

import { apiRequest, createdSchema, mockApi } from "@/lib/api";
import { readValues, submitForm } from "@/lib/forms/server";
import type { FormState } from "@/lib/forms/types";
import { admissionEnquirySchema } from "./schemas";

const FIELDS = [
  "parentName",
  "email",
  "phone",
  "childName",
  "yearGroup",
  "start",
  "prospectus",
  "visit",
  "message",
] as const;

/** Admissions "Request Information" form. */
export async function sendAdmissionEnquiry(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = readValues(formData, FIELDS);

  return submitForm({
    form: "admission-enquiry",
    formData,
    values,
    body: {
      ...values,
      phone: values.phone || undefined,
      message: values.message || undefined,
      // A ticked checkbox sends "on"; an unticked one sends nothing.
      prospectus: values.prospectus === "on",
      visit: values.visit === "on",
    },
    schema: admissionEnquirySchema,
    send: (body) =>
      apiRequest({
        method: "POST",
        path: "/admission-enquiries",
        body,
        schema: createdSchema,
        mock: () => mockApi.forms.admissionEnquiry(body),
      }),
    successMessage:
      "Thank you for your enquiry. A member of our admissions team will contact you within two working days.",
  });
}

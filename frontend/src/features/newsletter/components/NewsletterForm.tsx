"use client";

import { useActionState } from "react";
import { FormSuccess, SpamTrap, SubmitButton } from "@/components/forms/FormParts";
import { initialFormState } from "@/lib/forms/types";
import { subscribeToNewsletter } from "../actions";

/**
 * One-field sign-up form in the footer. Too small for an error summary: the error is shown under
 * the field and linked to it with aria-describedby.
 */
export function NewsletterForm() {
  const [state, action] = useActionState(subscribeToNewsletter, initialFormState);

  if (state.status === "success") return <FormSuccess state={state} />;

  const error = state.status === "error" ? (state.errors?.email?.[0] ?? state.message) : undefined;

  return (
    <form action={action} noValidate className="newsletter-form">
      <label htmlFor="newsletter-email" className="visually-hidden">
        Email address
      </label>
      <div className="newsletter-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          className="form-control"
          placeholder="Your email address"
          autoComplete="email"
          required
          maxLength={254}
          defaultValue={state.values?.email ?? ""}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
        />
        <SubmitButton pendingText="Subscribing...">Subscribe</SubmitButton>
      </div>
      {error && (
        <p id="newsletter-error" className="field-error" role="alert">
          {error}
        </p>
      )}
      <SpamTrap />
    </form>
  );
}

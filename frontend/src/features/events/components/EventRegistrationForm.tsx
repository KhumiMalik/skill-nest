"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormFields, SelectField, TextField } from "@/components/forms/Fields";
import { ErrorSummary, FormSuccess, SpamTrap, SubmitButton } from "@/components/forms/FormParts";
import { initialFormState } from "@/lib/forms/types";
import { registerForEvent } from "../actions";

type EventRegistrationFormProps = {
  slug: string;
  /** Most places one booking can take (capped by the event's capacity). */
  maxPlaces: number;
};

/** Booking form in the event page sidebar. */
export function EventRegistrationForm({ slug, maxPlaces }: EventRegistrationFormProps) {
  const [state, action] = useActionState(registerForEvent, initialFormState);

  if (state.status === "success") return <FormSuccess state={state} />;

  const placeOptions = Array.from({ length: maxPlaces }, (_, index) => {
    const places = String(index + 1);
    return { value: places, label: places };
  });

  return (
    <form action={action} noValidate className="d-flex flex-column gap-3">
      <FormFields id="booking" state={state}>
        <ErrorSummary id="booking" state={state} />
        {/* Only identifies the event; the action reads everything else about it from the API. */}
        <input type="hidden" name="event" value={slug} />
        <TextField name="name" label="Your name" autoComplete="name" maxLength={100} />
        <TextField name="email" label="Email address" type="email" autoComplete="email" maxLength={254} />
        <TextField name="phone" label="Phone number" type="tel" autoComplete="tel" optional maxLength={20} />
        <SelectField name="places" label="Number of places" options={placeOptions} placeholder="Choose" />
        <TextField
          name="notes"
          label="Access or dietary needs"
          rows={3}
          optional
          maxLength={500}
          hint="Tell us anything that would help you enjoy the event."
        />
        <SpamTrap />
        <p className="form-privacy mb-0">
          We use your details only for this booking. See our <Link href="/privacy">privacy policy</Link>.
        </p>
        <div>
          <SubmitButton pendingText="Booking...">Book Places</SubmitButton>
        </div>
      </FormFields>
    </form>
  );
}

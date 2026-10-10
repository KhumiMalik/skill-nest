"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormFields, SelectField, TextField } from "@/components/forms/Fields";
import { ErrorSummary, FormSuccess, SpamTrap, SubmitButton } from "@/components/forms/FormParts";
import { initialFormState } from "@/lib/forms/types";
import { sendContactMessage } from "../actions";
import { CONTACT_TOPIC_LABELS, CONTACT_TOPICS } from "../constants";

const TOPIC_OPTIONS = CONTACT_TOPICS.map((topic) => ({ value: topic, label: CONTACT_TOPIC_LABELS[topic] }));

/**
 * The contact form. It posts to a server action, so it also works before JavaScript loads (or
 * without it): the server runs the action and renders the page again with the result.
 */
export function ContactForm() {
  const [state, action] = useActionState(sendContactMessage, initialFormState);

  if (state.status === "success") return <FormSuccess state={state} />;

  return (
    <form action={action} noValidate>
      <FormFields id="contact" state={state}>
        <ErrorSummary id="contact" state={state} />
        <div className="row g-3">
          <div className="col-md-6">
            <TextField name="name" label="Your name" autoComplete="name" maxLength={100} />
          </div>
          <div className="col-md-6">
            <TextField name="email" label="Email address" type="email" autoComplete="email" maxLength={254} />
          </div>
          <div className="col-md-6">
            <TextField name="phone" label="Phone number" type="tel" autoComplete="tel" optional maxLength={20} />
          </div>
          <div className="col-md-6">
            <SelectField name="topic" label="Topic" options={TOPIC_OPTIONS} placeholder="Choose a topic" />
          </div>
          <div className="col-12">
            <TextField name="message" label="Message" rows={6} maxLength={3000} />
          </div>
          <div className="col-12">
            <SpamTrap />
            <p className="form-privacy">
              We only use your details to reply to you. See our <Link href="/privacy">privacy policy</Link>.
            </p>
            <SubmitButton>Send Message</SubmitButton>
          </div>
        </div>
      </FormFields>
    </form>
  );
}

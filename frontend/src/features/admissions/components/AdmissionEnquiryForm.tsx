"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckboxField, FormFields, SelectField, TextField } from "@/components/forms/Fields";
import { ErrorSummary, FormSuccess, SpamTrap, SubmitButton } from "@/components/forms/FormParts";
import { initialFormState } from "@/lib/forms/types";
import { sendAdmissionEnquiry } from "../actions";
import { START_OPTION_LABELS, START_OPTIONS, YEAR_GROUP_LABELS, YEAR_GROUPS } from "../constants";

const YEAR_GROUP_OPTIONS = YEAR_GROUPS.map((group) => ({ value: group, label: YEAR_GROUP_LABELS[group] }));
const START_OPTIONS_LIST = START_OPTIONS.map((option) => ({ value: option, label: START_OPTION_LABELS[option] }));

/** "Request Information" on the admissions page. Works with and without JavaScript (server action). */
export function AdmissionEnquiryForm() {
  const [state, action] = useActionState(sendAdmissionEnquiry, initialFormState);

  if (state.status === "success") return <FormSuccess state={state} />;

  return (
    <form action={action} noValidate>
      <FormFields id="enquiry" state={state}>
        <ErrorSummary id="enquiry" state={state} />
        <fieldset className="row g-3">
          <legend className="form-legend">About you</legend>
          <div className="col-md-6">
            <TextField name="parentName" label="Your name" autoComplete="name" maxLength={100} />
          </div>
          <div className="col-md-6">
            <TextField name="email" label="Email address" type="email" autoComplete="email" maxLength={254} />
          </div>
          <div className="col-md-6">
            <TextField name="phone" label="Phone number" type="tel" autoComplete="tel" optional maxLength={20} />
          </div>
        </fieldset>
        <fieldset className="row g-3 mt-2">
          <legend className="form-legend">About your child</legend>
          <div className="col-md-6">
            <TextField name="childName" label="Child's name" autoComplete="off" maxLength={100} />
          </div>
          <div className="col-md-6">
            <SelectField
              name="yearGroup"
              label="Year group they would join"
              options={YEAR_GROUP_OPTIONS}
              placeholder="Choose a year group"
            />
          </div>
          <div className="col-md-6">
            <SelectField
              name="start"
              label="When would they start?"
              options={START_OPTIONS_LIST}
              placeholder="Choose a start date"
            />
          </div>
        </fieldset>
        <fieldset className="mt-3">
          <legend className="form-legend">How can we help?</legend>
          <CheckboxField name="prospectus" label="Post me a printed prospectus" />
          <CheckboxField name="visit" label="I would like to arrange a visit" />
          <div className="mt-3">
            <TextField name="message" label="Questions or comments" rows={4} optional maxLength={2000} />
          </div>
        </fieldset>
        <SpamTrap />
        <p className="form-privacy">
          We use your details only to help with your enquiry. See our <Link href="/privacy">privacy policy</Link>.
        </p>
        <SubmitButton>Submit Request</SubmitButton>
      </FormFields>
    </form>
  );
}

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FormState } from "@/lib/forms/types";
import { CheckboxField, FormFields, SelectField, TextField } from "./Fields";
import { ErrorSummary } from "./FormParts";

const failed: FormState = {
  status: "error",
  message: "Please correct the errors below.",
  errors: { email: ["Enter a valid email address."] },
  values: { name: "Ada", email: "ada@", topic: "fees", prospectus: "on" },
};

function renderForm(state: FormState) {
  render(
    <FormFields id="contact" state={state}>
      <ErrorSummary id="contact" state={state} />
      <TextField name="name" label="Your name" />
      <TextField name="email" label="Email address" type="email" hint="We reply within a day." />
      <TextField name="phone" label="Phone number" optional />
      <SelectField
        name="topic"
        label="Topic"
        placeholder="Choose a topic"
        options={[
          { value: "general", label: "General" },
          { value: "fees", label: "Fees" },
        ]}
      />
      <CheckboxField name="prospectus" label="Send a prospectus" />
    </FormFields>,
  );
}

describe("form fields", () => {
  it("label every field and mark optional ones", () => {
    renderForm({ status: "idle" });
    expect(screen.getByLabelText("Your name")).toBeRequired();
    expect(screen.getByLabelText("Phone number (optional)")).not.toBeRequired();
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription("We reply within a day.");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("show errors on the field and in a summary that links to it", () => {
    renderForm(failed);
    const email = screen.getByLabelText(/Email address/);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("We reply within a day. Error: Enter a valid email address.");
    expect(screen.getByLabelText("Your name")).not.toHaveAttribute("aria-invalid");

    expect(screen.getByRole("heading", { name: "Please correct the errors below." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Enter a valid email address." })).toHaveAttribute(
      "href",
      "#contact-email",
    );
  });

  it("keep what the visitor typed after a failed submission", () => {
    renderForm(failed);
    expect(screen.getByLabelText("Your name")).toHaveValue("Ada");
    expect(screen.getByLabelText(/Email address/)).toHaveValue("ada@");
    expect(screen.getByLabelText("Topic")).toHaveValue("fees");
    expect(screen.getByLabelText("Send a prospectus")).toBeChecked();
  });
});

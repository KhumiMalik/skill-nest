"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { FormState } from "@/lib/forms/types";

type FormContextValue = { id: string; state: FormState };

const FormContext = createContext<FormContextValue | null>(null);

/**
 * Gives the fields inside a form their id prefix and the current form state (errors and values),
 * so each field doesn't need them passed by hand. `id` must be unique on the page, e.g. "contact".
 */
export function FormFields({ id, state, children }: FormContextValue & { children: ReactNode }) {
  return <FormContext.Provider value={{ id, state }}>{children}</FormContext.Provider>;
}

/** Ids, error and kept value of one field. */
function useField(name: string, hint?: string) {
  const context = useContext(FormContext);
  if (!context) throw new Error("Form fields must be inside <FormFields>.");
  const id = `${context.id}-${name}`;
  const error = context.state.errors?.[name]?.[0];
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return {
    id,
    error,
    defaultValue: context.state.values?.[name] ?? "",
    inputProps: { id, name, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy },
  };
}

type LabelProps = { id: string; label: string; optional?: boolean; hint?: string; error?: string };

/** Label, hint and error message around a control. Optional fields say so; all others are required. */
function FieldShell({ id, label, optional, hint, error, children }: LabelProps & { children: ReactNode }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
        {optional && <span className="optional"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          <span className="visually-hidden">Error:</span> {error}
        </p>
      )}
      {children}
    </div>
  );
}

type TextFieldProps = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  optional?: boolean;
  hint?: string;
  autoComplete?: string;
  maxLength?: number;
  /** Renders a <textarea> with this many rows. */
  rows?: number;
};

export function TextField({
  name,
  label,
  type = "text",
  optional,
  hint,
  autoComplete,
  maxLength,
  rows,
}: TextFieldProps) {
  const field = useField(name, hint);
  const common = {
    ...field.inputProps,
    className: "form-control",
    defaultValue: field.defaultValue,
    required: !optional,
    maxLength,
  };

  return (
    <FieldShell id={field.id} label={label} optional={optional} hint={hint} error={field.error}>
      {rows ? <textarea {...common} rows={rows} /> : <input {...common} type={type} autoComplete={autoComplete} />}
    </FieldShell>
  );
}

type SelectFieldProps = {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  optional?: boolean;
  hint?: string;
  /** First, empty option, e.g. "Choose a topic". */
  placeholder: string;
};

export function SelectField({ name, label, options, optional, hint, placeholder }: SelectFieldProps) {
  const field = useField(name, hint);

  return (
    <FieldShell id={field.id} label={label} optional={optional} hint={hint} error={field.error}>
      <select {...field.inputProps} className="form-select" defaultValue={field.defaultValue} required={!optional}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** A checkbox. Its value is "on" when ticked (the browser default), "" otherwise. */
export function CheckboxField({ name, label }: { name: string; label: string }) {
  const field = useField(name);

  return (
    <div className="form-check">
      <input
        {...field.inputProps}
        type="checkbox"
        className="form-check-input"
        defaultChecked={field.defaultValue === "on"}
      />
      <label htmlFor={field.id} className="form-check-label">
        {label}
      </label>
      {field.error && (
        <p id={`${field.id}-error`} className="field-error">
          {field.error}
        </p>
      )}
    </div>
  );
}

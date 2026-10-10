"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { type FormState, SPAM_FIELDS } from "@/lib/forms/types";
import { ClientIcon } from "../ui/ClientIcon";

/** Moves keyboard (and screen reader) focus to the element whenever a new result arrives. */
function useFocusOnResult<T extends HTMLElement>(state: FormState) {
  const ref = useRef<T>(null);
  useEffect(() => {
    // Each submission returns a new state object, so this runs once per result.
    if (state.status !== "idle") ref.current?.focus();
  }, [state]);
  return ref;
}

/**
 * "There is a problem" box above the form, listing every field error as a link to that field.
 * It receives focus after a failed submission, so screen reader users hear what went wrong.
 */
export function ErrorSummary({ id, state }: { id: string; state: FormState }) {
  const ref = useFocusOnResult<HTMLDivElement>(state);
  if (state.status !== "error") return null;
  const errors = Object.entries(state.errors ?? {}).filter(([, messages]) => messages.length > 0);

  return (
    <div ref={ref} className="form-alert" tabIndex={-1} aria-labelledby={`${id}-alert-title`}>
      <h2 id={`${id}-alert-title`} className="form-alert-title">
        <ClientIcon name="exclamation-circle" /> {state.message}
      </h2>
      {errors.length > 0 && (
        <ul>
          {errors.map(([name, messages]) => (
            <li key={name}>
              <a href={`#${id}-${name}`}>{messages[0]}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Replaces the form after a successful submission. Focused so the confirmation is announced. */
export function FormSuccess({ state, children }: { state: FormState; children?: ReactNode }) {
  const ref = useFocusOnResult<HTMLDivElement>(state);
  return (
    <div ref={ref} className="form-success-box" tabIndex={-1} role="status">
      <ClientIcon name="check-circle" className="form-success-icon" />
      <div>
        <p className="mb-0">{state.message}</p>
        {children}
      </div>
    </div>
  );
}

/**
 * Hidden anti-spam fields (see lib/forms/spam.ts): a honeypot people never see, and the time the
 * form was shown, filled in by the browser once the page is interactive.
 */
export function SpamTrap() {
  const startedAt = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  return (
    <>
      <div className="form-trap" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name={SPAM_FIELDS.honeypot} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name={SPAM_FIELDS.startedAt} defaultValue="" />
    </>
  );
}

/** Submit button that shows progress while the action runs (and blocks double submits). */
export function SubmitButton({ children, pendingText = "Sending..." }: { children: ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-main" disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

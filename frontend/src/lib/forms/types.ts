// Shared by server actions and form components (no server-only imports here).

/** What a form's server action returns to `useActionState`. */
export type FormState = {
  status: "idle" | "success" | "error";
  /** Shown instead of the form (success) or above it (error). */
  message?: string;
  /** Field name -> error messages. */
  errors?: Record<string, string[]>;
  /**
   * What the visitor typed. React resets a form after its action runs, so the fields use these
   * as `defaultValue` to keep the input after a failed submission (with or without JavaScript).
   */
  values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

/** Names of the hidden anti-spam fields that every form includes (see components/forms/SpamTrap). */
export const SPAM_FIELDS = {
  /** Hidden from people; bots that fill in every field fill this one too. */
  honeypot: "website",
  /** Time the form was shown (ms since epoch), set by the browser. */
  startedAt: "form_started_at",
} as const;

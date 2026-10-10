import "server-only";
import { headers } from "next/headers";
import type { z } from "zod";
import { serverEnv } from "@/config/env";
import { siteConfig } from "@/config/site";
import { isApiError, validationError } from "@/lib/api";
import { createRateLimiter } from "./rate-limit";
import { checkSpam } from "./spam";
import type { FormState } from "./types";

const limiter = createRateLimiter({ limit: serverEnv.FORM_RATE_LIMIT, windowMs: 10 * 60 * 1000 });

const MESSAGES = {
  invalid: "Please correct the errors below.",
  tooFast: "That was quick! Please check your details and send the form again.",
  rateLimited: "You have sent this form several times in the last few minutes. Please wait a little and try again.",
  failed: `Sorry, something went wrong and nothing was sent. Please try again, or email ${siteConfig.contact.email}.`,
};

/** The text values of the named fields, trimmed (missing fields are ""). Anything else in the form is ignored. */
export function readValues<K extends string>(formData: FormData, names: readonly K[]): Record<K, string> {
  const values = {} as Record<K, string>;
  for (const name of names) {
    const value = formData.get(name);
    values[name] = typeof value === "string" ? value.trim() : "";
  }
  return values;
}

/**
 * The visitor's IP address, used as the rate-limit key. Behind a proxy or CDN the first address in
 * X-Forwarded-For is the visitor's; make sure your host sets (and overwrites) that header.
 */
async function visitorIp(): Promise<string> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
}

type SubmitFormOptions<T extends z.ZodType> = {
  /** Name of the form, used as the rate-limit bucket, e.g. "contact". */
  form: string;
  formData: FormData;
  /** What the visitor typed, sent back after an error so the fields keep their values. */
  values: Record<string, string>;
  /** The API request body built from the values, validated with the API's own schema. */
  body: unknown;
  schema: T;
  /** Sends the validated body to the API (the endpoint validates it again). */
  send: (body: z.infer<T>) => Promise<unknown>;
  successMessage: string;
};

/**
 * The steps every form action takes, in order: spam checks, validation, rate limit, API call.
 * Returns the state the form shows; never throws for the visitor's mistakes.
 */
export async function submitForm<T extends z.ZodType>(options: SubmitFormOptions<T>): Promise<FormState> {
  const { form, formData, values, successMessage } = options;

  const spam = checkSpam(formData, { now: Date.now(), minFillMs: serverEnv.FORM_MIN_FILL_MS });
  // Pretend it worked: telling a bot it was caught only helps it adapt.
  if (spam === "bot") return { status: "success", message: successMessage };
  if (spam === "too-fast") return { status: "error", message: MESSAGES.tooFast, values };

  const parsed = options.schema.safeParse(options.body);
  if (!parsed.success) {
    return { status: "error", message: MESSAGES.invalid, errors: validationError(parsed.error).fieldErrors, values };
  }

  // Counted after validation, so fixing typos doesn't use up a visitor's attempts.
  if (!limiter.allow(`${form}:${await visitorIp()}`, Date.now())) {
    return { status: "error", message: MESSAGES.rateLimited, values };
  }

  try {
    await options.send(parsed.data);
  } catch (error) {
    if (isApiError(error) && error.status === 422) {
      // Field errors go next to the fields; an error about the whole form ("_form") becomes the message.
      const { _form: formErrors, ...errors } = error.fieldErrors;
      const hasFieldErrors = Object.keys(errors).length > 0;
      return {
        status: "error",
        message: formErrors?.[0] ?? (hasFieldErrors ? MESSAGES.invalid : error.message),
        errors,
        values,
      };
    }
    if (isApiError(error) && error.status === 429) return { status: "error", message: MESSAGES.rateLimited, values };
    console.error(`[forms] "${form}" submission failed:`, error);
    return { status: "error", message: MESSAGES.failed, values };
  }

  return { status: "success", message: successMessage };
}

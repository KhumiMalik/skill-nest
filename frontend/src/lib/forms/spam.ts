import { SPAM_FIELDS } from "./types";

export type SpamVerdict = "ok" | "bot" | "too-fast";

/**
 * Cheap spam checks that need no third-party service:
 * - honeypot: a field hidden from people. If it has a value, a bot filled it in ("bot").
 * - fill time: the browser records when the form appeared. A submit sooner than `minFillMs`
 *   afterwards is probably automated ("too-fast"). People who are that quick (autofill) are
 *   simply asked to send the form again, so nobody loses a real message.
 *   Without JavaScript the time is missing and this check is skipped; the honeypot and the
 *   rate limit still apply.
 */
export function checkSpam(formData: FormData, { now, minFillMs }: { now: number; minFillMs: number }): SpamVerdict {
  const honeypot = formData.get(SPAM_FIELDS.honeypot);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return "bot";

  const startedAt = Number(formData.get(SPAM_FIELDS.startedAt));
  if (startedAt > 0 && now - startedAt < minFillMs) return "too-fast";
  return "ok";
}

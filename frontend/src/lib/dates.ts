import { siteConfig } from "@/config/site";

// All dates are formatted in the school's time zone (siteConfig.timeZone), never the
// server's or visitor's, so a 9:00 event shows as 9:00 everywhere and on every server.

const { locale, timeZone } = siteConfig;

function toDate(value: string | Date): Date {
  return typeof value === "string" ? new Date(value) : value;
}

/** "4 October 2026" */
export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone }).format(
    toDate(value),
  );
}

/** "09:00" */
export function formatTime(value: string | Date): string {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(
    toDate(value),
  );
}

/** "09:00 - 15:00" */
export function formatTimeRange(start: string | Date, end: string | Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

/** Parts for date badges: { day: "15", month: "Feb", year: "2026" } */
export function dateParts(value: string | Date): { day: string; month: string; year: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  }).formatToParts(toDate(value));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: get("day"), month: get("month"), year: get("year") };
}

/** "2026-02" — the month key used by the events month filter, in the school's time zone. */
export function monthKey(value: string | Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone }).formatToParts(
    toDate(value),
  );
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${year}-${month}`;
}

/** "2026-02-15" — the calendar day in the school's time zone. Sorts and compares as a string. */
export function dayKey(value: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone }).format(
    toDate(value),
  );
}

/** Machine-readable value for <time dateTime>. */
export function isoDateTime(value: string | Date): string {
  return toDate(value).toISOString();
}

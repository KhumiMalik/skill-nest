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

// ---- Months ("2026-10" keys). Pure calendar arithmetic, independent of time zones. ----

function parseMonth(month: string): { year: number; month: number } {
  const [year, monthNumber] = month.split("-").map(Number);
  if (!year || !monthNumber) throw new Error(`Invalid month key: ${month}`);
  return { year, month: monthNumber };
}

/** "2026-11" for addMonths("2026-10", 1); handles year boundaries and negative counts. */
export function addMonths(month: string, count: number): string {
  const parsed = parseMonth(month);
  const index = parsed.year * 12 + (parsed.month - 1) + count;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}

/** First and last day of a month as day keys: { from: "2026-02-01", to: "2026-02-28" }. */
export function monthBounds(month: string): { from: string; to: string } {
  const { year, month: monthNumber } = parseMonth(month);
  const lastDay = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const prefix = `${year}-${String(monthNumber).padStart(2, "0")}`;
  return { from: `${prefix}-01`, to: `${prefix}-${String(lastDay).padStart(2, "0")}` };
}

/** "October 2026" for "2026-10". */
export function formatMonth(month: string): string {
  const { year, month: monthNumber } = parseMonth(month);
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, monthNumber - 1, 1)),
  );
}

/** "Friday 9 October" for a day key ("2026-10-09"). */
export function formatDayKey(day: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(`${day}T12:00:00Z`),
  );
}

/** Machine-readable value for <time dateTime>. */
export function isoDateTime(value: string | Date): string {
  return toDate(value).toISOString();
}

/**
 * "14 November 2026" (or "14 Nov 2026") for a day key ("2026-11-14"), e.g. a deadline.
 * A day key is a calendar date without a time, so it is never shifted into another time zone.
 */
export function formatDay(day: string, month: "long" | "short" = "long"): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month, year: "numeric", timeZone: "UTC" }).format(
    new Date(`${day}T12:00:00Z`),
  );
}

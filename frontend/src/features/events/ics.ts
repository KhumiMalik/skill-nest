import type { SchoolEvent } from "./types";

// Builds an iCalendar (.ics) file for one event, so visitors can add it to Google, Apple or
// Outlook calendars. Format: RFC 5545 (https://www.rfc-editor.org/rfc/rfc5545).

/** "2026-10-09T09:00:00Z" -> "20261009T090000Z" (UTC). */
function icsDate(value: string | Date): string {
  const iso = typeof value === "string" ? new Date(value).toISOString() : value.toISOString();
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Text values must escape backslashes, semicolons, commas and newlines. */
function icsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Lines longer than 75 bytes are folded: continued on the next line, which starts with a space. */
function fold(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  for (const char of line) {
    const limit = parts.length === 0 ? 75 : 74; // continuation lines start with a space
    if (encoder.encode(current + char).length > limit) {
      parts.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts.join("\r\n ");
}

type IcsOptions = {
  /** Public site URL, e.g. "https://greenfield-academy.example". */
  siteUrl: string;
  /** When the file was generated (DTSTAMP). */
  now: Date;
};

export function buildIcs(event: SchoolEvent, { siteUrl, now }: IcsOptions): string {
  const url = new URL(`/events/${event.slug}`, siteUrl).toString();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Greenfield Academy//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@${new URL(siteUrl).hostname}`,
    `DTSTAMP:${icsDate(now)}`,
    `DTSTART:${icsDate(event.startsAt)}`,
    `DTEND:${icsDate(event.endsAt)}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(`${event.summary}\n\nMore information: ${url}`)}`,
    // Venue only: some events are off site, so the school address would be wrong for them.
    // The venue, plus its address when it is away from the school.
    `LOCATION:${icsText(event.address ? `${event.location}, ${event.address}` : event.location)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // RFC 5545 requires CRLF line endings, including after the last line.
  return `${lines.map(fold).join("\r\n")}\r\n`;
}

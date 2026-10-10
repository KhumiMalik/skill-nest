import { dayKey, monthBounds } from "@/lib/dates";
import type { EventSummary } from "./types";

/** "2026-10-10" for "2026-10-09". Day keys are calendar days, so plain UTC arithmetic is safe. */
export function nextDay(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

/**
 * The weeks of a month for a calendar grid, Monday first. Each cell is a day key, or `null`
 * for the padding days before the 1st and after the last day.
 */
export function calendarWeeks(month: string): (string | null)[][] {
  const { from, to } = monthBounds(month);
  // getUTCDay(): Sunday = 0. Shift so that Monday = 0.
  const offset = (new Date(`${from}T00:00:00Z`).getUTCDay() + 6) % 7;

  const cells: (string | null)[] = Array.from({ length: offset }, () => null);
  for (let day = from; day <= to; day = nextDay(day)) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  return weeks;
}

/** Groups events under every day of the month they run on (multi-day events appear on each day). */
export function eventsByDay(events: EventSummary[], month: string): Map<string, EventSummary[]> {
  const { from, to } = monthBounds(month);
  const byDay = new Map<string, EventSummary[]>();
  for (const event of events) {
    const start = dayKey(event.startsAt);
    const end = dayKey(event.endsAt);
    for (let day = start < from ? from : start; day <= end && day <= to; day = nextDay(day)) {
      byDay.set(day, [...(byDay.get(day) ?? []), event]);
    }
  }
  return byDay;
}

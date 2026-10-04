import { dayKey, formatDate, formatTimeRange } from "@/lib/dates";

/** "09:00 - 15:00" for a one-day event, "11 January 2027 to 22 January 2027" when it spans several days. */
export function formatEventWhen(startsAt: string, endsAt: string): string {
  return dayKey(startsAt) === dayKey(endsAt)
    ? formatTimeRange(startsAt, endsAt)
    : `${formatDate(startsAt)} to ${formatDate(endsAt)}`;
}

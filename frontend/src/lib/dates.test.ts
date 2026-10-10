import { describe, expect, it } from "vitest";
import {
  addMonths,
  dateParts,
  dayKey,
  formatDate,
  formatDay,
  formatDayKey,
  formatMonth,
  formatTime,
  formatTimeRange,
  monthBounds,
  monthKey,
} from "./dates";

// siteConfig.timeZone is UTC, so these expectations don't depend on the machine's time zone.
describe("dates", () => {
  const start = "2026-02-15T09:00:00Z";
  const end = "2026-02-15T15:30:00Z";

  it("formats a long date", () => {
    expect(formatDate(start)).toBe("15 February 2026");
  });

  it("formats 24-hour times and ranges", () => {
    expect(formatTime(start)).toBe("09:00");
    expect(formatTimeRange(start, end)).toBe("09:00 - 15:30");
  });

  it("splits a date into badge parts", () => {
    expect(dateParts(start)).toEqual({ day: "15", month: "Feb", year: "2026" });
  });

  it("builds a month key in the school time zone", () => {
    expect(monthKey("2026-03-31T23:30:00Z")).toBe("2026-03");
    expect(monthKey(new Date("2026-12-01T00:00:00Z"))).toBe("2026-12");
  });

  it("does month arithmetic across year boundaries", () => {
    expect(addMonths("2026-12", 1)).toBe("2027-01");
    expect(addMonths("2026-01", -1)).toBe("2025-12");
    expect(addMonths("2026-10", -18)).toBe("2025-04");
  });

  it("finds the first and last day of a month, including leap years", () => {
    expect(monthBounds("2028-02")).toEqual({ from: "2028-02-01", to: "2028-02-29" });
    expect(monthBounds("2026-02")).toEqual({ from: "2026-02-01", to: "2026-02-28" });
    expect(monthBounds("2026-12")).toEqual({ from: "2026-12-01", to: "2026-12-31" });
  });

  it("formats months and day keys", () => {
    expect(formatMonth("2026-10")).toBe("October 2026");
    expect(formatDayKey("2026-10-09")).toBe("Friday 9 October");
    expect(formatDay("2026-11-04")).toBe("4 November 2026");
    expect(formatDay("2026-11-04", "short")).toBe("4 Nov 2026");
  });

  it("builds a sortable day key in the school time zone", () => {
    expect(dayKey("2026-10-04T23:59:00Z")).toBe("2026-10-04");
    expect(dayKey("2026-10-04T23:59:00Z") < dayKey("2026-10-05T00:00:00Z")).toBe(true);
  });
});

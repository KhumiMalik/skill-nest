import { describe, expect, it } from "vitest";
import { dateParts, dayKey, formatDate, formatTime, formatTimeRange, monthKey } from "./dates";

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

  it("builds a sortable day key in the school time zone", () => {
    expect(dayKey("2026-10-04T23:59:00Z")).toBe("2026-10-04");
    expect(dayKey("2026-10-04T23:59:00Z") < dayKey("2026-10-05T00:00:00Z")).toBe(true);
  });
});

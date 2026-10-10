import { describe, expect, it } from "vitest";
import { calendarWeeks, eventsByDay, nextDay } from "./calendar";
import type { EventSummary } from "./types";

function event(slug: string, startsAt: string, endsAt: string): EventSummary {
  return {
    slug,
    title: slug,
    summary: "",
    category: "academic",
    startsAt,
    endsAt,
    location: "Main Hall",
    image: { src: "https://placehold.co/800x500/png", alt: "", width: 800, height: 500 },
    featured: false,
  };
}

describe("calendar", () => {
  it("moves to the next day across month and year ends", () => {
    expect(nextDay("2026-10-31")).toBe("2026-11-01");
    expect(nextDay("2026-12-31")).toBe("2027-01-01");
  });

  it("lays out a month in Monday-first weeks", () => {
    // 1 October 2026 is a Thursday; 31 October is a Saturday.
    const weeks = calendarWeeks("2026-10");
    expect(weeks).toHaveLength(5);
    expect(weeks[0]).toEqual([null, null, null, "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04"]);
    expect(weeks.at(-1)).toEqual([
      "2026-10-26",
      "2026-10-27",
      "2026-10-28",
      "2026-10-29",
      "2026-10-30",
      "2026-10-31",
      null,
    ]);
    for (const week of weeks) expect(week).toHaveLength(7);
  });

  it("puts multi-day events on every day they run, within the month only", () => {
    const byDay = eventsByDay(
      [
        event("concert", "2026-12-16T18:00:00Z", "2026-12-16T19:30:00Z"),
        event("exams", "2026-12-30T08:30:00Z", "2027-01-02T16:00:00Z"),
      ],
      "2026-12",
    );
    expect(byDay.get("2026-12-16")?.map((e) => e.slug)).toEqual(["concert"]);
    expect(byDay.get("2026-12-30")?.map((e) => e.slug)).toEqual(["exams"]);
    expect(byDay.get("2026-12-31")?.map((e) => e.slug)).toEqual(["exams"]);
    expect(byDay.has("2027-01-01")).toBe(false);
    expect(byDay.has("2026-12-17")).toBe(false);
  });
});

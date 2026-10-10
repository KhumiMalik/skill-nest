import { describe, expect, it } from "vitest";
import { buildIcs } from "./ics";
import type { SchoolEvent } from "./types";

const event: SchoolEvent = {
  slug: "carol-service-2026",
  title: "Carol Service; readings, carols",
  summary: "Our traditional service of readings and carols, sung by the school choirs and the whole congregation.",
  category: "arts",
  startsAt: "2026-12-16T18:00:00Z",
  endsAt: "2026-12-16T19:30:00Z",
  location: "St Mary's Church",
  image: { src: "https://placehold.co/800x500/png", alt: "", width: 800, height: 500 },
  featured: false,
  description: [{ type: "paragraph", text: "Details." }],
  schedule: [],
  organizer: { name: "Ms Olivia Grant", role: "Director of Music", email: "music@example.com" },
  cost: "Free",
  registration: null,
};

const ics = buildIcs(event, { siteUrl: "https://greenfield.example", now: new Date("2026-10-05T10:00:00Z") });
const lines = ics.split("\r\n");

describe("buildIcs", () => {
  it("uses CRLF line endings, including at the end", () => {
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics.replace(/\r\n/g, "")).not.toContain("\n");
  });

  it("writes UTC dates and a stable UID", () => {
    expect(lines).toContain("DTSTART:20261216T180000Z");
    expect(lines).toContain("DTEND:20261216T193000Z");
    expect(lines).toContain("DTSTAMP:20261005T100000Z");
    expect(lines).toContain("UID:carol-service-2026@greenfield.example");
    expect(lines).toContain("URL:https://greenfield.example/events/carol-service-2026");
  });

  it("escapes commas and semicolons in text", () => {
    expect(lines).toContain("SUMMARY:Carol Service\\; readings\\, carols");
  });

  it("folds lines longer than 75 bytes", () => {
    for (const line of lines) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    const description = ics.slice(ics.indexOf("DESCRIPTION:"), ics.indexOf("LOCATION:"));
    // Unfolding (removing CRLF + space) restores the original text.
    expect(description.replace(/\r\n /g, "")).toContain("More information: https://greenfield.example/events/");
  });

  it("uses the venue as the location, with its address when it is away from the school", () => {
    expect(lines).toContain("LOCATION:St Mary's Church");
    const offSite = buildIcs(
      { ...event, address: "Church Street, Greenfield GF1 4SM" },
      { siteUrl: "https://greenfield.example", now: new Date("2026-10-05T10:00:00Z") },
    );
    expect(offSite).toContain("LOCATION:St Mary's Church\\, Church Street\\, Greenfield GF1 4SM");
  });
});

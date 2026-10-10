import { describe, expect, it } from "vitest";
import type { z } from "zod";
import { vacancySchema, vacancySummarySchema } from "@/features/careers/schemas";
import { eventSchema, eventSummarySchema } from "@/features/events/schemas";
import { departmentSchema, facultyMemberSchema, facultySummarySchema } from "@/features/faculty/schemas";
import { faqSchema } from "@/features/faq/schemas";
import { albumSchema, albumSummarySchema } from "@/features/gallery/schemas";
import { newsArticleSchema, newsCategoryCountSchema, newsSummarySchema } from "@/features/news/schemas";
import { noticeSchema, noticeSummarySchema } from "@/features/notices/schemas";
import {
  aboutPageSchema,
  admissionsPageSchema,
  alumniPageSchema,
  campusPageSchema,
  careersPageSchema,
  homePageSchema,
  legalPageSchema,
  programsPageSchema,
  studentLifePageSchema,
} from "@/features/page-content/schemas";
import { programSchema, programSummarySchema } from "@/features/programs/schemas";
import { ApiError } from "@/lib/api/errors";
import { createdSchema, paginatedSchema } from "@/lib/api/schemas";
import { mockOutbox } from "./forms";
import { mockApi } from "./index";
import { matchesSearch } from "./utils";

/** Runs a mock like the API layer does: through JSON, then through the response schema. */
function asResponse<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  return schema.parse(JSON.parse(JSON.stringify(value)));
}

// Contract tests: every mock response must match the schema the frontend validates the real API with.
describe("mock API matches the API contract", () => {
  it("pages", () => {
    expect(() => asResponse(homePageSchema, mockApi.pages.get("home"))).not.toThrow();
    expect(() => asResponse(aboutPageSchema, mockApi.pages.get("about"))).not.toThrow();
    expect(() => asResponse(programsPageSchema, mockApi.pages.get("programs"))).not.toThrow();
    expect(() => asResponse(admissionsPageSchema, mockApi.pages.get("admissions"))).not.toThrow();
    expect(() => asResponse(campusPageSchema, mockApi.pages.get("campus"))).not.toThrow();
    expect(() => asResponse(studentLifePageSchema, mockApi.pages.get("student-life"))).not.toThrow();
    expect(() => asResponse(alumniPageSchema, mockApi.pages.get("alumni"))).not.toThrow();
    expect(() => asResponse(careersPageSchema, mockApi.pages.get("careers"))).not.toThrow();
    expect(() => asResponse(legalPageSchema, mockApi.pages.get("privacy"))).not.toThrow();
    expect(() => asResponse(legalPageSchema, mockApi.pages.get("terms"))).not.toThrow();
  });

  it("faqs", () => {
    expect(() => asResponse(paginatedSchema(faqSchema), mockApi.faqs.list({ pageSize: 50 }))).not.toThrow();
  });

  it("gallery", () => {
    const list = asResponse(paginatedSchema(albumSummarySchema), mockApi.gallery.list({ pageSize: 50 }));
    for (const album of list.data) {
      expect(() => asResponse(albumSchema, mockApi.gallery.get(album.slug))).not.toThrow();
    }
  });

  it("careers", () => {
    // From a date before every closing date, so the list includes all vacancies.
    const list = asResponse(
      paginatedSchema(vacancySummarySchema),
      mockApi.careers.list({ pageSize: 50 }, new Date("2026-01-01T00:00:00Z")),
    );
    for (const vacancy of list.data) {
      expect(() => asResponse(vacancySchema, mockApi.careers.get(vacancy.slug))).not.toThrow();
    }
  });

  it("programs", () => {
    const list = asResponse(paginatedSchema(programSummarySchema), mockApi.programs.list({ pageSize: 50 }));
    for (const program of list.data) {
      expect(() => asResponse(programSchema, mockApi.programs.get(program.slug))).not.toThrow();
    }
  });

  it("faculty and departments", () => {
    const list = asResponse(paginatedSchema(facultySummarySchema), mockApi.faculty.list({ pageSize: 50 }));
    for (const member of list.data) {
      expect(() => asResponse(facultyMemberSchema, mockApi.faculty.get(member.slug))).not.toThrow();
    }
    expect(() => asResponse(paginatedSchema(departmentSchema), mockApi.departments.list())).not.toThrow();
  });

  it("news", () => {
    const list = asResponse(paginatedSchema(newsSummarySchema), mockApi.news.list({ pageSize: 50 }));
    for (const article of list.data) {
      expect(() => asResponse(newsArticleSchema, mockApi.news.get(article.slug))).not.toThrow();
    }
    expect(() => asResponse(paginatedSchema(newsCategoryCountSchema), mockApi.news.categories())).not.toThrow();
  });

  it("notices", () => {
    const list = asResponse(paginatedSchema(noticeSummarySchema), mockApi.notices.list({ pageSize: 50 }));
    for (const notice of list.data) {
      expect(() => asResponse(noticeSchema, mockApi.notices.get(notice.slug))).not.toThrow();
    }
  });

  it("events", () => {
    const list = asResponse(paginatedSchema(eventSummarySchema), mockApi.events.list({ pageSize: 50 }));
    for (const event of list.data) {
      expect(() => asResponse(eventSchema, mockApi.events.get(event.slug))).not.toThrow();
    }
  });

  it("uses unique slugs", () => {
    for (const { data } of [
      mockApi.programs.list({ pageSize: 50 }),
      mockApi.faculty.list({ pageSize: 50 }),
      mockApi.news.list({ pageSize: 50 }),
      mockApi.notices.list({ pageSize: 50 }),
      mockApi.events.list({ pageSize: 50 }),
      mockApi.gallery.list({ pageSize: 50 }),
      mockApi.careers.list({ pageSize: 50 }, new Date("2026-01-01T00:00:00Z")),
    ]) {
      const slugs = data.map((item) => item.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("points the programs spotlight at an existing program", () => {
    const { spotlight } = programsPageSchema.parse(mockApi.pages.get("programs"));
    expect(() => mockApi.programs.get(spotlight.programSlug)).not.toThrow();
  });

  it("points the campus page at an existing gallery album", () => {
    const { galleryAlbum } = campusPageSchema.parse(mockApi.pages.get("campus"));
    expect(() => mockApi.gallery.get(galleryAlbum)).not.toThrow();
  });

  it("uses unique FAQ ids (they are page anchors)", () => {
    const ids = mockApi.faqs.list({ pageSize: 50 }).data.map((faq) => faq.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("mock handlers", () => {
  it("return 404 ApiErrors for unknown slugs and pages", () => {
    expect(() => mockApi.programs.get("nope")).toThrow(ApiError);
    expect(() => mockApi.faculty.get("nope")).toThrow(expect.objectContaining({ status: 404 }));
    expect(() => mockApi.pages.get("toString")).toThrow(expect.objectContaining({ status: 404 }));
  });

  it("reject an invalid page size with a 422", () => {
    expect(() => mockApi.faculty.list({ pageSize: 500 })).toThrow(expect.objectContaining({ status: 422 }));
  });

  it("filter programs by level and featured flag", () => {
    const sixthForm = mockApi.programs.list({ level: "sixth-form" }).data;
    expect(sixthForm.length).toBeGreaterThan(0);
    expect(sixthForm.every((program) => program.level === "sixth-form")).toBe(true);
    // List responses are summaries without the detail fields.
    expect(sixthForm[0]).not.toHaveProperty("overview");

    const featured = mockApi.programs.list({ featured: true }).data;
    expect(featured.every((program) => program.featured)).toBe(true);
  });

  it("filter and search faculty, accent- and case-insensitively", () => {
    const science = mockApi.faculty.list({ department: "science" });
    expect(science.meta.total).toBe(3);
    expect(science.data.every((member) => member.department.slug === "science")).toBe(true);

    expect(mockApi.faculty.list({ q: "HART" }).data.map((m) => m.slug)).toEqual(["amelia-hart"]);
    // Also matches subjects taught.
    expect(mockApi.faculty.list({ q: "chemistry" }).data.map((m) => m.slug)).toContain("amelia-hart");
    expect(mockApi.faculty.list({ q: "nobody at all" }).meta.total).toBe(0);
    expect(matchesSearch("dvorak", "Antonín Dvořák")).toBe(true);
  });

  it("paginate faculty", () => {
    const page2 = mockApi.faculty.list({ page: 2, pageSize: 12 });
    expect(page2.meta).toEqual({ page: 2, pageSize: 12, total: 26, totalPages: 3 });
    expect(page2.data).toHaveLength(12);
  });

  it("count staff per department", () => {
    const departments = mockApi.departments.list().data;
    const total = departments.reduce((sum, department) => sum + department.staffCount, 0);
    expect(total).toBe(mockApi.faculty.list({ pageSize: 50 }).meta.total);
  });

  it("sort news newest first", () => {
    const dates = mockApi.news.list({ pageSize: 50 }).data.map((article) => article.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("return events that end on or after `from`, soonest first", () => {
    const events = mockApi.events.list({ from: "2026-10-04", pageSize: 50 }).data;
    expect(events[0]?.slug).toBe("harvest-festival-assembly-2026");
    expect(events.every((event) => event.endsAt >= "2026-10-04")).toBe(true);
    // A multi-day event still counts while it is running.
    expect(mockApi.events.list({ from: "2027-01-20" }).data[0]?.slug).toBe("year-13-mock-examinations-2027");
  });

  it("filter events by date range (overlap), category and featured flag", () => {
    const december = mockApi.events.list({ from: "2026-12-01", to: "2026-12-31", pageSize: 50 }).data;
    expect(december.map((event) => event.slug)).toEqual([
      "london-alumni-drinks-2026",
      "christmas-fair-2026",
      "carol-service-2026",
    ]);
    // The mock exams start on 11 January, so they overlap a range that ends on the 15th.
    expect(mockApi.events.list({ from: "2027-01-15", to: "2027-01-15" }).data.map((e) => e.slug)).toEqual([
      "year-13-mock-examinations-2027",
    ]);
    expect(mockApi.events.list({ category: "sports" }).data.every((e) => e.category === "sports")).toBe(true);
    expect(mockApi.events.list({ featured: true }).data.every((e) => e.featured)).toBe(true);
  });

  it("filter and search news; list items are summaries", () => {
    const sports = mockApi.news.list({ category: "sports" }).data;
    expect(sports.length).toBeGreaterThan(0);
    expect(sports.every((article) => article.category === "sports")).toBe(true);
    expect(sports[0]).not.toHaveProperty("body");
    expect(sports[0]?.author).not.toHaveProperty("bio");
    // Matches tags as well as titles.
    expect(mockApi.news.list({ q: "Robotics" }).data.map((a) => a.slug)).toContain(
      "robotics-team-qualifies-for-national-final",
    );
  });

  it("count news per category", () => {
    const counts = mockApi.news.categories().data;
    const total = counts.reduce((sum, { count }) => sum + count, 0);
    expect(total).toBe(mockApi.news.list({}).meta.total);
  });

  it("list important notices first, then newest first", () => {
    const notices = mockApi.notices.list({ pageSize: 50 }).data;
    const firstOrdinary = notices.findIndex((notice) => !notice.important);
    expect(notices.slice(firstOrdinary).some((notice) => notice.important)).toBe(false);
    const ordinaryDates = notices.slice(firstOrdinary).map((notice) => notice.publishedAt);
    expect(ordinaryDates).toEqual([...ordinaryDates].sort().reverse());
    expect(mockApi.notices.list({ category: "exams" }).data.every((n) => n.category === "exams")).toBe(true);
  });

  it("filter FAQs by category, keeping display order", () => {
    const admissions = mockApi.faqs.list({ category: "admissions" }).data;
    expect(admissions.length).toBeGreaterThan(0);
    expect(admissions.every((faq) => faq.category.slug === "admissions")).toBe(true);
  });

  it("list albums newest first, as summaries with a photo count", () => {
    const albums = mockApi.gallery.list({}).data;
    const dates = albums.map((album) => album.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(albums[0]).not.toHaveProperty("photos");
    const first = albums[0];
    expect(first && mockApi.gallery.get(first.slug).photos).toHaveLength(first?.photoCount ?? -1);
    expect(() => mockApi.gallery.get("nope")).toThrow(expect.objectContaining({ status: 404 }));
  });

  it("list only open vacancies, closing soonest first, but still return closed ones by slug", () => {
    const now = new Date("2026-10-09T09:00:00Z");
    const open = mockApi.careers.list({ pageSize: 50 }, now).data;
    expect(open.every((vacancy) => new Date(vacancy.closesAt) > now)).toBe(true);
    expect(open.map((vacancy) => vacancy.slug)).not.toContain("school-receptionist-2026");
    const closing = open.map((vacancy) => vacancy.closesAt);
    expect(closing).toEqual([...closing].sort());
    expect(open[0]).not.toHaveProperty("description");
    expect(mockApi.careers.get("school-receptionist-2026").closesAt).toBe("2026-09-25T12:00:00Z");
    expect(mockApi.careers.list({ category: "support" }, now).data.every((v) => v.category === "support")).toBe(true);
  });
});

describe("form endpoints", () => {
  const contact = { name: "Ada Lovelace", email: "ada@example.com", topic: "general", message: "Hello there!" };

  it("accept valid submissions, record them and return 201-style bodies", () => {
    const before = mockOutbox.length;
    expect(createdSchema.parse(mockApi.forms.contactMessage(contact))).toMatchObject({ message: expect.any(String) });
    expect(mockOutbox).toHaveLength(before + 1);
    expect(mockOutbox.at(-1)).toMatchObject({ endpoint: "POST /contact-messages", body: contact });
    expect(() => mockApi.forms.newsletterSubscription({ email: "ada@example.com" })).not.toThrow();
    expect(() =>
      mockApi.forms.admissionEnquiry({
        parentName: "Ada Lovelace",
        email: "ada@example.com",
        childName: "Byron",
        yearGroup: "year-7",
        start: "next-september",
        prospectus: true,
        visit: false,
      }),
    ).not.toThrow();
  });

  it("reject invalid bodies with a 422 and field errors", () => {
    let error: unknown;
    try {
      mockApi.forms.contactMessage({ ...contact, email: "nope", topic: "gossip" });
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(422);
    expect(Object.keys((error as ApiError).fieldErrors).sort()).toEqual(["email", "topic"]);
  });
});

describe("event registration endpoint", () => {
  const booking = { name: "Ada Lovelace", email: "ada@example.com", places: 2 };
  const beforeDeadlines = new Date("2026-09-01T00:00:00Z");

  it("books places while booking is open", () => {
    expect(mockApi.events.register("alumni-careers-evening-2026", booking, beforeDeadlines)).toMatchObject({
      message: "Booking confirmed.",
    });
  });

  it("refuses more places than are left", () => {
    // The mentoring breakfast starts with 38 of 40 places taken.
    expect(() =>
      mockApi.events.register("alumni-mentoring-breakfast-2027", { ...booking, places: 5 }, beforeDeadlines),
    ).toThrow(
      expect.objectContaining({
        status: 422,
        body: expect.objectContaining({ errors: { places: ["Only 2 places are left."] } }),
      }),
    );
  });

  it("refuses bookings after the deadline, for events without booking, and for unknown events", () => {
    const afterDeadline = new Date("2026-12-01T00:00:00Z");
    expect(() => mockApi.events.register("alumni-careers-evening-2026", booking, afterDeadline)).toThrow(
      expect.objectContaining({ status: 422 }),
    );
    expect(() => mockApi.events.register("carol-service-2026", booking, beforeDeadlines)).toThrow(
      expect.objectContaining({ status: 422 }),
    );
    expect(() => mockApi.events.register("no-such-event", booking, beforeDeadlines)).toThrow(
      expect.objectContaining({ status: 404 }),
    );
  });
});

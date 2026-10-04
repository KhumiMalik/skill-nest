import { describe, expect, it } from "vitest";
import type { z } from "zod";
import { eventSummarySchema } from "@/features/events/schemas";
import { departmentSchema, facultyMemberSchema, facultySummarySchema } from "@/features/faculty/schemas";
import { newsSummarySchema } from "@/features/news/schemas";
import { aboutPageSchema, homePageSchema, programsPageSchema } from "@/features/page-content/schemas";
import { programSchema, programSummarySchema } from "@/features/programs/schemas";
import { ApiError } from "@/lib/api/errors";
import { paginatedSchema } from "@/lib/api/schemas";
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

  it("news and events", () => {
    expect(() => asResponse(paginatedSchema(newsSummarySchema), mockApi.news.list({ pageSize: 50 }))).not.toThrow();
    expect(() => asResponse(paginatedSchema(eventSummarySchema), mockApi.events.list({ pageSize: 50 }))).not.toThrow();
  });

  it("uses unique slugs", () => {
    for (const { data } of [
      mockApi.programs.list({ pageSize: 50 }),
      mockApi.faculty.list({ pageSize: 50 }),
      mockApi.news.list({ pageSize: 50 }),
      mockApi.events.list({ pageSize: 50 }),
    ]) {
      const slugs = data.map((item) => item.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("points the programs spotlight at an existing program", () => {
    const { spotlight } = programsPageSchema.parse(mockApi.pages.get("programs"));
    expect(() => mockApi.programs.get(spotlight.programSlug)).not.toThrow();
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
});

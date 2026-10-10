import { describe, expect, it } from "vitest";
import { groupFaqs } from "./group";
import type { Faq } from "./types";

const faq = (id: string, category: string): Faq => ({
  id,
  question: `${id}?`,
  answer: ["Yes."],
  category: { slug: category, name: category.toUpperCase() },
});

describe("groupFaqs", () => {
  it("groups by category in order of first appearance", () => {
    const groups = groupFaqs([faq("a", "fees"), faq("b", "uniform"), faq("c", "fees")]);
    expect(groups.map((group) => group.category.slug)).toEqual(["fees", "uniform"]);
    expect(groups[0]?.faqs.map((item) => item.id)).toEqual(["a", "c"]);
  });

  it("returns no groups for no questions", () => {
    expect(groupFaqs([])).toEqual([]);
  });
});

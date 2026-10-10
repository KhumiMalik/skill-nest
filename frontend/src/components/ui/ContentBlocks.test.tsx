import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ContentBlock } from "@/lib/api/schemas";
import { ContentBlocks, getHeadings, readingMinutes, slugify, TableOfContents } from "./ContentBlocks";

const blocks: ContentBlock[] = [
  { type: "paragraph", text: "Intro paragraph." },
  { type: "heading", text: "Results & highlights" },
  { type: "list", items: ["First", "Second"] },
  { type: "heading", text: "Results & highlights" },
  { type: "quote", text: "A memorable day.", cite: "The Head" },
  { type: "heading", text: "Café opening" },
  { type: "callout", title: "Key dates", text: "Term starts on 3 September." },
];

describe("content block helpers", () => {
  it("slugifies headings, removing accents and punctuation", () => {
    expect(slugify("Café opening!")).toBe("cafe-opening");
    expect(slugify("  Results & highlights ")).toBe("results-highlights");
  });

  it("gives every heading a unique id", () => {
    expect(getHeadings(blocks).map((heading) => heading.id)).toEqual([
      "results-highlights",
      "results-highlights-2",
      "cafe-opening",
    ]);
  });

  it("estimates reading time, at least one minute", () => {
    expect(readingMinutes(blocks)).toBe(1);
    expect(readingMinutes([{ type: "paragraph", text: "word ".repeat(1000) }])).toBe(5);
  });
});

describe("ContentBlocks", () => {
  it("renders headings with ids, lists, quotes with citations and callouts", () => {
    render(<ContentBlocks blocks={blocks} />);
    expect(screen.getAllByRole("heading", { level: 2, name: "Results & highlights" })[1]).toHaveAttribute(
      "id",
      "results-highlights-2",
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("A memorable day.").closest("figure")).toHaveTextContent("The Head");
    expect(screen.getByRole("complementary", { name: "Key dates" })).toHaveTextContent("Term starts");
  });

  it("links the table of contents to the headings", () => {
    render(<TableOfContents blocks={blocks} />);
    expect(screen.getByRole("navigation", { name: "Contents" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Café opening" })).toHaveAttribute("href", "#cafe-opening");
  });

  it("hides the table of contents for short articles", () => {
    const { container } = render(<TableOfContents blocks={blocks.slice(0, 3)} />);
    expect(container).toBeEmptyDOMElement();
  });
});

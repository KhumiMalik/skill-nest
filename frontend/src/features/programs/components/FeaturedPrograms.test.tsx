import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { ProgramSummary } from "../types";
import { FeaturedPrograms } from "./FeaturedPrograms";
import { ProgramCard } from "./ProgramCard";

function program(slug: string, title: string, level: ProgramSummary["level"]): ProgramSummary {
  return {
    slug,
    title,
    level,
    ageRange: "Ages 11-14",
    duration: "3 years",
    classSize: "Up to 22 pupils",
    summary: `${title} summary`,
    image: { src: "https://placehold.co/800x500/png", alt: title, width: 800, height: 500 },
    featured: true,
  };
}

const programs = [
  program("reception", "Reception", "early-years"),
  program("key-stage-3", "Key Stage 3", "secondary"),
  program("gcse-programme", "GCSE Programme", "secondary"),
];

// In the app the section renders the cards on the server and passes them in; here we do the same.
const items = programs.map((p) => ({ slug: p.slug, level: p.level, card: <ProgramCard program={p} /> }));

describe("FeaturedPrograms", () => {
  it("shows all programs and only the stages that have programs", () => {
    render(<FeaturedPrograms items={items} />);
    const group = screen.getByRole("group", { name: "Filter programs by stage" });
    expect(
      within(group)
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual(["All Programs", "Early Years", "Secondary"]);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("filters by stage with toggle buttons", async () => {
    const user = userEvent.setup();
    render(<FeaturedPrograms items={items} />);

    await user.click(screen.getByRole("button", { name: "Secondary" }));
    expect(screen.getByRole("button", { name: "Secondary" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All Programs" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("status")).toHaveTextContent("Showing 2 of 3 programs");
  });
});

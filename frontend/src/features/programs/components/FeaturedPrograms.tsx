"use client";

import { type ReactNode, useState } from "react";
import { PROGRAM_LEVEL_LABELS, PROGRAM_LEVELS } from "../constants";
import type { ProgramLevel } from "../types";

type Filter = ProgramLevel | "all";

export type FeaturedProgramItem = {
  slug: string;
  level: ProgramLevel;
  /** The card, rendered on the server (see FeaturedProgramsSection). */
  card: ReactNode;
};

/**
 * Featured programs with stage filter buttons (the template's `.filter-buttons`).
 * Filtering a handful of cards already on the page is instant in the browser, so this is
 * client-side state rather than a URL filter. Without JavaScript every card stays visible.
 *
 * The cards arrive already rendered by the server: this component only shows and hides them, so
 * their code (and the icons they use) stays out of the browser bundle.
 */
export function FeaturedPrograms({ items }: { items: FeaturedProgramItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const levels = PROGRAM_LEVELS.filter((level) => items.some((item) => item.level === level));
  const isVisible = (item: FeaturedProgramItem) => filter === "all" || item.level === filter;
  const visibleCount = items.filter(isVisible).length;

  const options: { value: Filter; label: string }[] = [
    { value: "all", label: "All Programs" },
    ...levels.map((level) => ({ value: level, label: PROGRAM_LEVEL_LABELS[level] })),
  ];

  return (
    <>
      <div className="filter-buttons" role="group" aria-label="Filter programs by stage">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={filter === option.value ? "active" : undefined}
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="visually-hidden" role="status">
        {`Showing ${visibleCount} of ${items.length} programs`}
      </p>
      <div className="row g-4">
        {items.map((item) => (
          <div className="col-lg-6" key={item.slug} hidden={!isVisible(item)}>
            {item.card}
          </div>
        ))}
      </div>
    </>
  );
}

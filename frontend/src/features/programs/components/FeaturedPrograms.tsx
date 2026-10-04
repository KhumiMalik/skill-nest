"use client";

import { useState } from "react";
import { PROGRAM_LEVEL_LABELS, PROGRAM_LEVELS } from "../schemas";
import type { ProgramLevel, ProgramSummary } from "../types";
import { ProgramCard } from "./ProgramCard";

type Filter = ProgramLevel | "all";

/**
 * Featured programs with stage filter buttons (the template's `.filter-buttons`).
 * Filtering a handful of cards already on the page is instant in the browser, so this is
 * client-side state rather than a URL filter. Without JavaScript every card stays visible.
 */
export function FeaturedPrograms({ programs }: { programs: ProgramSummary[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const levels = PROGRAM_LEVELS.filter((level) => programs.some((program) => program.level === level));
  const visible = filter === "all" ? programs : programs.filter((program) => program.level === filter);

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
        {`Showing ${visible.length} of ${programs.length} programs`}
      </p>
      <div className="row g-4">
        {visible.map((program) => (
          <div className="col-lg-6" key={program.slug}>
            <ProgramCard program={program} />
          </div>
        ))}
      </div>
    </>
  );
}

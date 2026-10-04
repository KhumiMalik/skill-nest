import { type TabItem, Tabs } from "@/components/ui/Tabs";
import { PROGRAM_LEVEL_LABELS, PROGRAM_LEVELS } from "../schemas";
import type { ProgramSummary } from "../types";
import { ProgramMediaCard } from "./ProgramMediaCard";

/**
 * All programs, one tab per stage. The panels are rendered here on the server and handed to
 * the client-side Tabs component, so only the tab switching itself needs JavaScript.
 */
export function ProgramsByLevel({ programs }: { programs: ProgramSummary[] }) {
  const tabs: TabItem[] = PROGRAM_LEVELS.flatMap((level) => {
    const inLevel = programs.filter((program) => program.level === level);
    if (inLevel.length === 0) return [];
    return {
      id: level,
      label: PROGRAM_LEVEL_LABELS[level],
      panel: (
        <ul className="row g-4 list-unstyled mb-0">
          {inLevel.map((program) => (
            <li className="col-lg-4 col-md-6" key={program.slug}>
              <ProgramMediaCard program={program} />
            </li>
          ))}
        </ul>
      ),
    };
  });

  return <Tabs label="Programs by stage" tabs={tabs} />;
}

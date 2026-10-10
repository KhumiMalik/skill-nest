import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ProgramSummary } from "../types";
import { FeaturedPrograms } from "./FeaturedPrograms";
import { ProgramCard } from "./ProgramCard";

export function FeaturedProgramsSection({ programs }: { programs: ProgramSummary[] }) {
  if (programs.length === 0) return null;

  return (
    <section id="featured-programs" className="section">
      <div className="container">
        <SectionTitle
          title="Featured Programs"
          subtitle="From first steps in Nursery to university applications in the Sixth Form, every stage is designed to stretch and support."
        />
        {/* Cards are rendered here, on the server; the client component only filters them. */}
        <FeaturedPrograms
          items={programs.map((program) => ({
            slug: program.slug,
            level: program.level,
            card: <ProgramCard program={program} />,
          }))}
        />
      </div>
    </section>
  );
}

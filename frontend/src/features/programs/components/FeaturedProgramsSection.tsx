import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ProgramSummary } from "../types";
import { FeaturedPrograms } from "./FeaturedPrograms";

export function FeaturedProgramsSection({ programs }: { programs: ProgramSummary[] }) {
  if (programs.length === 0) return null;

  return (
    <section id="featured-programs" className="section">
      <div className="container">
        <SectionTitle
          title="Featured Programs"
          subtitle="From first steps in Nursery to university applications in the Sixth Form, every stage is designed to stretch and support."
        />
        <FeaturedPrograms programs={programs} />
      </div>
    </section>
  );
}

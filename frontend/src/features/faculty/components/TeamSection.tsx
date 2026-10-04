import { SectionTitle } from "@/components/ui/SectionTitle";
import type { FacultySummary } from "../types";
import { PersonCard } from "./PersonCard";

type TeamSectionProps = {
  title: string;
  subtitle?: string;
  people: FacultySummary[];
  className?: string;
};

/** A titled grid of staff cards: the leadership team, or colleagues on a profile page. */
export function TeamSection({ title, subtitle, people, className = "section" }: TeamSectionProps) {
  if (people.length === 0) return null;

  return (
    <section className={className}>
      <div className="container">
        <SectionTitle title={title} subtitle={subtitle} />
        <ul className="row g-4 justify-content-center list-unstyled">
          {people.map((person) => (
            <li className="col-lg-3 col-md-6 reveal" key={person.slug}>
              <PersonCard person={person} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

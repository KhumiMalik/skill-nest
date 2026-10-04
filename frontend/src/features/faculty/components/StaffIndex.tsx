import Link from "next/link";
import type { Department, FacultySummary } from "../types";

type StaffIndexProps = { people: FacultySummary[]; departments: Department[] };

/**
 * Every staff member as a plain list of links, grouped by department. Shown only to visitors
 * without JavaScript (inside <noscript>), who can't see the streamed, filterable directory.
 * Profile pages are prerendered, so every link works without JavaScript too.
 */
export function StaffIndex({ people, departments }: StaffIndexProps) {
  return (
    <div className="sidebar-box">
      <h2>Staff directory</h2>
      <p>Searching and filtering need JavaScript. Here is everyone at Greenfield, by department.</p>
      {departments.map((department) => {
        const members = people.filter((person) => person.department.slug === department.slug);
        if (members.length === 0) return null;
        return (
          <section key={department.slug}>
            <h3 className="h5 mt-4">{department.name}</h3>
            <ul className="plain">
              {members.map((person) => (
                <li key={person.slug}>
                  <Link href={`/faculty/${person.slug}`}>{person.name}</Link>
                  <span>{person.role}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

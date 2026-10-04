import Link from "next/link";
import { Icon, toIconName } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { facultyHref } from "../filters";
import type { Department } from "../types";

export function DepartmentsSection({ departments }: { departments: Department[] }) {
  return (
    <section className="section section-alt" aria-labelledby="departments-heading">
      <div className="container">
        <SectionTitle
          id="departments-heading"
          title="Departments"
          subtitle="Specialist teams who share their expertise, plan together and support every pupil's progress."
        />
        <ul className="row g-4 list-unstyled">
          {departments.map((department) => (
            <li className="col-lg-4 col-md-6 reveal" key={department.slug}>
              <div className="card-box">
                <div className="icon-circle">
                  <Icon name={toIconName(department.icon, "book")} />
                </div>
                <h3>{department.name}</h3>
                <p>{department.description}</p>
                <Link href={facultyHref({ department: department.slug })} className="link-arrow mt-3">
                  Meet the team<span className="visually-hidden">: {department.name}</span>
                  <Icon name="arrow-right" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

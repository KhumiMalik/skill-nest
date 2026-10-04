import Form from "next/form";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import type { Paginated } from "@/lib/api/schemas";
import { type FacultyFilters, facultyHref } from "../filters";
import type { Department, FacultySummary } from "../types";
import { PersonCard } from "./PersonCard";

type FacultyDirectoryProps = {
  filters: FacultyFilters;
  result: Paginated<FacultySummary>;
  departments: Department[];
};

/**
 * Search box, department filter and results. Filtering is done by the server from the URL:
 * the search form submits with GET and the departments are plain links, so every filtered view
 * is a shareable URL. `next/form` turns the search into a client-side navigation.
 */
export function FacultyDirectory({ filters, result, departments }: FacultyDirectoryProps) {
  const { page, pageSize, total, totalPages } = result.meta;
  const first = (page - 1) * pageSize + 1;
  const last = first + result.data.length - 1;
  const allStaffCount = departments.reduce((sum, department) => sum + department.staffCount, 0);
  const activeDepartment = departments.find((department) => department.slug === filters.department);

  return (
    <div className="row g-4">
      <aside className="col-lg-3" aria-label="Filter staff">
        <div className="sidebar-box">
          <h2>Search</h2>
          <Form action="/faculty" role="search" aria-label="Staff">
            {filters.department && <input type="hidden" name="department" value={filters.department} />}
            <label htmlFor="faculty-search" className="visually-hidden">
              Search by name, role or subject
            </label>
            <div className="search-field">
              <input
                // A new key resets the field when the URL changes (e.g. after "Clear filters").
                key={filters.q ?? ""}
                id="faculty-search"
                type="search"
                name="q"
                defaultValue={filters.q}
                maxLength={100}
                className="form-control"
                placeholder="Name, role or subject"
              />
              <button type="submit" className="btn-main">
                <Icon name="search" label="Search" />
              </button>
            </div>
          </Form>
        </div>

        <div className="sidebar-box">
          <h2>Departments</h2>
          <ul className="plain filter-list">
            <li>
              <Link
                href={facultyHref({ q: filters.q })}
                className={!filters.department ? "active" : undefined}
                aria-current={!filters.department ? "true" : undefined}
              >
                All departments
              </Link>
              <span>{allStaffCount}</span>
            </li>
            {departments.map((department) => {
              const active = department.slug === filters.department;
              return (
                <li key={department.slug}>
                  <Link
                    href={facultyHref({ department: department.slug, q: filters.q })}
                    className={active ? "active" : undefined}
                    aria-current={active ? "true" : undefined}
                  >
                    {department.name}
                  </Link>
                  <span>{department.staffCount}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="col-lg-9">
        <h2 className="visually-hidden">Staff members</h2>
        <p className="results-summary" role="status">
          {total === 0 ? "No staff members match your search." : `Showing ${first}-${last} of ${total} staff members`}
          {activeDepartment && ` in ${activeDepartment.name}`}
          {filters.q && ` matching "${filters.q}"`}
        </p>

        {total === 0 ? (
          <div className="empty-state">
            <p>Try a different name, role or subject, or browse the whole staff directory.</p>
            <Link href="/faculty" className="btn-outline-main">
              Clear filters
            </Link>
          </div>
        ) : (
          <ul className="row g-4 list-unstyled">
            {result.data.map((person) => (
              <li className="col-md-6 col-lg-4" key={person.slug}>
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          hrefForPage={(target) => facultyHref({ ...filters, page: target })}
        />
      </div>
    </div>
  );
}

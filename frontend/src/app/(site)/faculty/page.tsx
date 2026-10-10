import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner } from "@/components/layout/PageBanner";
import {
  DepartmentsSection,
  type Department,
  FACULTY_PAGE_SIZE,
  FacultyDirectory,
  FacultyDirectorySkeleton,
  getDepartments,
  getFaculty,
  parseFacultyFilters,
  StaffIndex,
} from "@/features/faculty";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Faculty & Staff",
  description:
    "Meet the teachers and staff of Greenfield Academy. Search the staff directory by name, role, subject or department.",
  path: "/faculty",
});

/**
 * The banner, intro and departments are prerendered (static shell). The directory depends on
 * the URL's search params (?department=&q=&page=), which are only known per request, so it
 * streams in inside <Suspense> while the skeleton is shown. Streaming needs JavaScript, so
 * visitors without it get a plain list of all staff instead (search engines get the full page).
 */
export default async function FacultyPage({ searchParams }: PageProps<"/faculty">) {
  const [departments, everyone] = await Promise.all([getDepartments(), getFaculty({ pageSize: 50 })]);

  return (
    <>
      <PageBanner title="Faculty & Staff" description="Experienced, caring specialists who know every pupil by name." />
      <section id="faculty-staff" className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5 reveal">
              <p>
                Our teachers are subject experts and dedicated mentors. Many have worked in research, industry and the
                arts before teaching, and all of them share a commitment to helping every pupil do their best.
              </p>
            </div>
          </div>
          <Suspense
            fallback={
              <FacultyDirectorySkeleton
                noScriptFallback={<StaffIndex people={everyone.data} departments={departments} />}
              />
            }
          >
            <Directory searchParams={searchParams} departments={departments} />
          </Suspense>
        </div>
      </section>
      <DepartmentsSection departments={departments} />
    </>
  );
}

type DirectoryProps = {
  searchParams: PageProps<"/faculty">["searchParams"];
  departments: Department[];
};

async function Directory({ searchParams, departments }: DirectoryProps) {
  const filters = parseFacultyFilters(await searchParams);
  const result = await getFaculty({
    department: filters.department,
    q: filters.q,
    page: filters.page,
    pageSize: FACULTY_PAGE_SIZE,
  });
  return <FacultyDirectory filters={filters} result={result} departments={departments} />;
}

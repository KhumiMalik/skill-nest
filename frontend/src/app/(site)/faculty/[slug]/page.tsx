import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import { FacultyProfile, getFaculty, getFacultyMember, TeamSection } from "@/features/faculty";

/**
 * A "blocking route": slugs that were not prerendered (content added after the build, or a
 * mistyped URL) render on the server on their first visit instead of streaming into an App Shell.
 * Known slugs are prerendered by generateStaticParams, so this only affects unknown ones.
 * Missing slugs get a real 404 status (see docs/architecture.md, "Not-found pages").
 */
export const instant = false;

/** Prerender every profile at build time. Staff added later render on their first visit. */
export async function generateStaticParams() {
  const { data } = await getFaculty({ pageSize: 50 });
  return data.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: PageProps<"/faculty/[slug]">): Promise<Metadata> {
  const member = await getFacultyMember((await params).slug);
  if (!member) return { title: "Staff member not found" };
  return { title: `${member.name}, ${member.role}`, description: member.shortBio };
}

export default async function FacultyMemberPage({ params }: PageProps<"/faculty/[slug]">) {
  const { slug } = await params;
  const member = await getFacultyMember(slug);
  if (!member) notFound();

  const { data: department } = await getFaculty({ department: member.department.slug, pageSize: 4 });
  const colleagues = department.filter((person) => person.slug !== member.slug).slice(0, 3);

  return (
    <>
      <PageBanner
        title={member.name}
        description={member.role}
        breadcrumbs={[{ label: "Faculty & Staff", href: "/faculty" }, { label: member.name }]}
      />
      <FacultyProfile member={member} />
      <TeamSection title={`More from ${member.department.name}`} people={colleagues} className="section section-alt" />
    </>
  );
}

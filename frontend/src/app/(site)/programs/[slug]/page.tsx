import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import { getProgram, getPrograms, ProgramDetail } from "@/features/programs";

/**
 * A "blocking route": slugs that were not prerendered (content added after the build, or a
 * mistyped URL) render on the server on their first visit instead of streaming into an App Shell.
 * Known slugs are prerendered by generateStaticParams, so this only affects unknown ones.
 * Missing slugs get a real 404 status (see docs/architecture.md, "Not-found pages").
 */
export const instant = false;

/** Prerender every program at build time. Programs added later render on their first visit. */
export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const program = await getProgram((await params).slug);
  if (!program) return { title: "Program not found" };
  return { title: program.title, description: program.summary };
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const sameLevel = await getPrograms({ level: program.level });
  const related = sameLevel.filter((item) => item.slug !== program.slug);

  return (
    <>
      <PageBanner
        title={program.title}
        description={program.ageRange}
        breadcrumbs={[{ label: "Programs", href: "/programs" }, { label: program.title }]}
      />
      <ProgramDetail program={program} related={related} />
    </>
  );
}

import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getProgramsPage, ProgramSpotlight, ProgramsIntro } from "@/features/page-content";
import { getPrograms, ProgramsByLevel } from "@/features/programs";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Programs",
  description:
    "Explore Greenfield Academy's programs from Nursery and Primary to GCSE, A Level and university preparation in the Sixth Form.",
  path: "/programs",
});

export default async function ProgramsPage() {
  const [content, programs] = await Promise.all([getProgramsPage(), getPrograms()]);

  return (
    <>
      <PageBanner
        title="Programs"
        description="An ambitious, well-rounded education at every stage, from age 3 to 18."
      />
      <section id="programs" className="section">
        <div className="container">
          <ProgramsIntro intro={content.intro} stats={content.stats} />
          <SectionTitle
            title="Our Programs"
            subtitle="Choose a stage to see the programs on offer, then open any program for subjects, class sizes and entry points."
          />
          <ProgramsByLevel programs={programs} />
          <ProgramSpotlight spotlight={content.spotlight} />
        </div>
      </section>
    </>
  );
}

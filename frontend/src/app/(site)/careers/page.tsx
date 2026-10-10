import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { siteConfig } from "@/config/site";
import { getVacancies, VacancyList } from "@/features/careers";
import { CareersIntro, getCareersPage, RecruitmentSection } from "@/features/page-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description: "Current teaching and support staff vacancies at Greenfield Academy, staff benefits and how to apply.",
  path: "/careers",
});

export default async function CareersPage() {
  const [page, vacancies] = await Promise.all([getCareersPage(), getVacancies()]);

  return (
    <>
      <PageBanner title="Careers" description="Teaching and support roles in a friendly, ambitious school." />
      <CareersIntro page={page} />
      <section id="vacancies" className="section section-alt">
        <div className="container">
          <SectionTitle
            title="Current Vacancies"
            subtitle="Open roles for teachers and support staff. Each vacancy closes at noon on its closing date."
          />
          <VacancyList vacancies={vacancies} contactEmail={siteConfig.contact.recruitmentEmail} />
        </div>
      </section>
      <RecruitmentSection page={page} />
    </>
  );
}

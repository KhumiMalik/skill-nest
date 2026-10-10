import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import { getVacancies, getVacancy, VacancyDetail, VacancyJsonLd } from "@/features/careers";
import { pageMetadata } from "@/lib/seo/metadata";

/** A "blocking route", like the other detail pages (see docs/architecture.md). */
export const instant = false;

/** Prerender open vacancies; closed ones (old links) render on their first visit with a "closed" note. */
export async function generateStaticParams() {
  const vacancies = await getVacancies();
  return vacancies.map((vacancy) => ({ slug: vacancy.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const vacancy = await getVacancy((await params).slug);
  if (!vacancy) return { title: "Vacancy not found" };
  return pageMetadata({ title: vacancy.title, description: vacancy.summary, path: `/careers/${vacancy.slug}` });
}

export default async function VacancyPage({ params }: PageProps<"/careers/[slug]">) {
  const vacancy = await getVacancy((await params).slug);
  if (!vacancy) notFound();

  return (
    <>
      <VacancyJsonLd vacancy={vacancy} />
      <PageBanner
        title={vacancy.title}
        description={vacancy.department}
        breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: vacancy.title }]}
      />
      <section className="section">
        <div className="container">
          <VacancyDetail vacancy={vacancy} />
        </div>
      </section>
    </>
  );
}

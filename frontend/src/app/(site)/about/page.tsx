import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { getFaculty, LEADERSHIP_DEPARTMENT, TeamSection } from "@/features/faculty";
import { getAboutPage, HeadMessageSection, HistorySection } from "@/features/page-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Founded in 1974, Greenfield Academy is an independent day school for ages 3 to 18. Discover our history, mission and values, and meet our leadership team.",
  path: "/about",
});

export default async function AboutPage() {
  const [about, leadership] = await Promise.all([
    getAboutPage(),
    getFaculty({ department: LEADERSHIP_DEPARTMENT, pageSize: 50 }),
  ]);

  return (
    <>
      <PageBanner
        title="About Us"
        description="Five decades of helping young people learn, grow and find their place in the world."
      />
      <HistorySection about={about} />
      <HeadMessageSection message={about.headMessage} />
      <TeamSection
        title="Leadership Team"
        subtitle="The senior team responsible for teaching, pastoral care and the day-to-day life of the school."
        people={leadership.data}
      />
    </>
  );
}

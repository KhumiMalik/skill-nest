import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import {
  ActivitiesSection,
  getStudentLifePage,
  StudentFacilitiesSection,
  StudentLifeIntro,
  SupportSection,
  TeamsSection,
} from "@/features/page-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Student Life",
  description:
    "Clubs, sport, music, drama, leadership and service: discover life beyond the classroom at Greenfield Academy, and the support every pupil receives.",
  path: "/student-life",
});

export default async function StudentLifePage() {
  const page = await getStudentLifePage();

  return (
    <>
      <PageBanner title="Student Life" description="Clubs, teams, performances and friendships that last a lifetime." />
      <StudentLifeIntro page={page} />
      <ActivitiesSection activities={page.activities} />
      <TeamsSection teams={page.teams} />
      <StudentFacilitiesSection facilities={page.facilities} />
      <SupportSection support={page.support} cta={page.cta} />
    </>
  );
}

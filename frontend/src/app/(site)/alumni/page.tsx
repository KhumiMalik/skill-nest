import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { EventDateList, getUpcomingEvents } from "@/features/events";
import { AlumniEventsSection, AlumniIntro, AlumniSpotlights, getAlumniPage } from "@/features/page-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Alumni",
  description:
    "Stay connected with Greenfield Academy: alumni events, mentoring, the careers network and ways to support the next generation.",
  path: "/alumni",
});

export default async function AlumniPage() {
  const [page, events] = await Promise.all([getAlumniPage(), getUpcomingEvents(4, "alumni")]);

  return (
    <>
      <PageBanner title="Alumni" description="A lifelong community of former pupils around the world." />
      <AlumniIntro page={page} />
      <AlumniSpotlights spotlights={page.spotlights} />
      <AlumniEventsSection events={<EventDateList events={events} category="alumni" />} giving={page.giving} />
    </>
  );
}

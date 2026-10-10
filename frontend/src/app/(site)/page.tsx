import type { Metadata } from "next";
import { EventStrip, getUpcomingEvents, UpcomingEvents } from "@/features/events";
import { getLatestNews, LatestNews } from "@/features/news";
import {
  AchievementsSection,
  getHomePage,
  HomeHero,
  StudentLifeSection,
  TestimonialsSection,
  WelcomeSection,
} from "@/features/page-content";
import { FeaturedProgramsSection, getPrograms } from "@/features/programs";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { schoolJsonLd } from "@/lib/seo/json-ld";
import { baseOpenGraph, DEFAULT_OG_IMAGE } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  // The root layout's default title ("Greenfield Academy") is used for the home page.
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    ...baseOpenGraph,
    images: [DEFAULT_OG_IMAGE],
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
  },
};

/**
 * Home page. Every read is cached ("use cache"), so the whole page is prerendered at build time.
 * Upcoming events are cached for an hour, which makes the page refresh at least hourly.
 */
export default async function HomePage() {
  const [content, programs, events, news] = await Promise.all([
    getHomePage(),
    getPrograms({ featured: true }),
    getUpcomingEvents(4),
    getLatestNews(3),
  ]);

  return (
    <>
      <JsonLd data={schoolJsonLd()} />
      <HomeHero hero={content.hero} highlights={content.highlights}>
        <EventStrip events={events.slice(0, 3)} />
      </HomeHero>
      <WelcomeSection welcome={content.welcome} pillars={content.pillars} />
      <FeaturedProgramsSection programs={programs} />
      <StudentLifeSection studentLife={content.studentLife} />
      <TestimonialsSection testimonials={content.testimonials} />
      <AchievementsSection achievements={content.achievements} />
      <LatestNews articles={news} />
      <UpcomingEvents events={events} />
    </>
  );
}

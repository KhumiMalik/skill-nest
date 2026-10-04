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
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  // The root layout's default title ("Greenfield Academy") is used for the home page.
  description: siteConfig.description,
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

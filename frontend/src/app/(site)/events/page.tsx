import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { PageBanner } from "@/components/layout/PageBanner";
import { LinkIndex, ResultsSkeleton } from "@/components/ui/ResultsSkeleton";
import {
  EventCalendar,
  EventList,
  EVENTS_PAGE_SIZE,
  EventsSidebar,
  EventsToolbar,
  getEvents,
  getFeaturedEvent,
  getUpcomingEvents,
  parseEventFilters,
} from "@/features/events";
import { dayKey, formatDate, monthBounds } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Events",
  description:
    "Open mornings, concerts, fixtures and community events at Greenfield Academy, as a list or a monthly calendar.",
  path: "/events",
});

/**
 * The banner and sidebar are prerendered (cached, refreshed hourly). The list/calendar depends
 * on ?month=&category=&view=&page= and on today's date, so it streams in at request time.
 */
export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const [upcoming, featured, allUpcoming] = await Promise.all([
    getUpcomingEvents(3),
    getFeaturedEvent(),
    getUpcomingEvents(30),
  ]);

  return (
    <>
      <PageBanner
        title="Events"
        description="Open mornings, concerts, fixtures and community events. Everyone is welcome."
      />
      <section id="events-list" className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <Suspense
                fallback={
                  <ResultsSkeleton
                    variant="rows"
                    count={4}
                    label="Loading events"
                    noScriptFallback={
                      <LinkIndex
                        title="Upcoming events"
                        note="Filters and the calendar need JavaScript. Here are all upcoming events."
                        items={allUpcoming.map((event) => ({
                          href: `/events/${event.slug}`,
                          title: event.title,
                          meta: formatDate(event.startsAt),
                        }))}
                      />
                    }
                  />
                }
              >
                <EventsResults searchParams={searchParams} />
              </Suspense>
            </div>
            <div className="col-lg-4">
              <EventsSidebar upcoming={upcoming} featured={featured} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

async function EventsResults({ searchParams }: { searchParams: PageProps<"/events">["searchParams"] }) {
  const filters = parseEventFilters(await searchParams);
  // "Upcoming" and "this month" depend on today's date, so read the clock at request time.
  await connection();
  const today = dayKey(new Date());
  const thisMonth = today.slice(0, 7);

  if (filters.view === "calendar") {
    const month = filters.month ?? thisMonth;
    const { data } = await getEvents({ ...monthBounds(month), category: filters.category, pageSize: 50 });
    return (
      <>
        <EventsToolbar filters={filters} currentMonth={month} />
        <EventCalendar filters={filters} month={month} events={data} today={today} />
      </>
    );
  }

  const range = filters.month ? monthBounds(filters.month) : { from: today };
  const result = await getEvents({
    ...range,
    category: filters.category,
    page: filters.page,
    pageSize: EVENTS_PAGE_SIZE,
  });
  return (
    <>
      <EventsToolbar filters={filters} currentMonth={filters.month ?? thisMonth} />
      <EventList filters={filters} result={result} />
    </>
  );
}

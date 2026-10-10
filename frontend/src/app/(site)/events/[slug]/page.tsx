import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout/PageBanner";
import { EventDetail, eventJsonLd, getEvent, getEvents, getUpcomingEvents } from "@/features/events";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";

/** A "blocking route", like the other detail pages (see docs/architecture.md). */
export const instant = false;

/** Prerender every event of the school year at build time; events added later render on their first visit. */
export async function generateStaticParams() {
  const { data } = await getEvents({ pageSize: 50 });
  return data.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return { title: "Event not found" };
  return pageMetadata({
    title: event.title,
    description: event.summary,
    path: `/events/${event.slug}`,
    ownImage: true, // events/[slug]/opengraph-image.tsx
  });
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const sameCategory = await getUpcomingEvents(4, event.category);
  const related = sameCategory.filter((item) => item.slug !== event.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={eventJsonLd(event)} />
      <PageBanner
        title={event.title}
        description={`${formatDate(event.startsAt)}, ${event.location}`}
        breadcrumbs={[{ label: "Events", href: "/events" }, { label: event.title }]}
      />
      <section id="event-details" className="section">
        <div className="container">
          <EventDetail event={event} related={related} />
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { EventSummary } from "../types";
import { EventCard } from "./EventCard";

export function UpcomingEvents({ events }: { events: EventSummary[] }) {
  return (
    <section id="events" className="section">
      <div className="container">
        <SectionTitle
          title="Upcoming Events"
          subtitle="Open mornings, concerts, fixtures and community events. Everyone is welcome."
        />
        {events.length > 0 ? (
          <ul className="row g-4 list-unstyled">
            {events.map((event) => (
              <li className="col-lg-6 reveal" key={event.slug}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">There are no upcoming events at the moment. Please check back soon.</p>
        )}
        <div className="text-center mt-5">
          <Link href="/events" className="btn-pill btn-wide">
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}

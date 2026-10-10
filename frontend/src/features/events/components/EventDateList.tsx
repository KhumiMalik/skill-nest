import Link from "next/link";
import { dateParts, isoDateTime } from "@/lib/dates";
import { eventsHref } from "../filters";
import type { EventCategory, EventSummary } from "../types";

type EventDateListProps = {
  events: EventSummary[];
  /** Links to the full list of events in this category, and shapes the "nothing planned" text. */
  category: EventCategory;
};

/** Compact rows with a date block (e.g. upcoming alumni events). */
export function EventDateList({ events, category }: EventDateListProps) {
  if (events.length === 0) {
    return (
      <p className="mb-0">
        Nothing is planned at the moment.{" "}
        <Link href={eventsHref({ category, view: "calendar" })}>See the calendar</Link>.
      </p>
    );
  }

  return (
    <ul className="list-unstyled mb-0">
      {events.map((event) => {
        const { day, month } = dateParts(event.startsAt);
        return (
          <li className="deadline-row" key={event.slug}>
            <div className="d-flex gap-3 align-items-center">
              <time className="date-block" dateTime={isoDateTime(event.startsAt)}>
                <span className="day">{day}</span>
                <span className="month">{month}</span>
              </time>
              <div>
                <h3 className="h4">{event.title}</h3>
                <p>{event.location}</p>
              </div>
            </div>
            <Link href={`/events/${event.slug}`} className="btn-outline-main">
              RSVP<span className="visually-hidden">: {event.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

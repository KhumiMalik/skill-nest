import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { dateParts, isoDateTime } from "@/lib/dates";
import { formatEventWhen } from "../format";
import { EVENT_CATEGORY_LABELS } from "../schemas";
import type { EventSummary } from "../types";

export function EventCard({ event }: { event: EventSummary }) {
  const { day, month, year } = dateParts(event.startsAt);

  return (
    <article className="event-card2">
      <time className="ev-date" dateTime={isoDateTime(event.startsAt)}>
        <span className="m">{month}</span> <span className="d">{day}</span> <span className="y">{year}</span>
      </time>
      <div className="ev-body">
        <span className={`ev-badge ${event.category}`}>{EVENT_CATEGORY_LABELS[event.category]}</span>
        <h3>
          <Link href={`/events/${event.slug}`}>{event.title}</Link>
        </h3>
        <p>{event.summary}</p>
        <ul className="ev-meta list-unstyled">
          <li>
            <Icon name="clock" />
            {formatEventWhen(event.startsAt, event.endsAt)}
          </li>
          <li>
            <Icon name="geo-alt" />
            {event.location}
          </li>
        </ul>
        <div className="ev-actions">
          <Link href={`/events/${event.slug}`} className="btn-pill">
            Learn More<span className="visually-hidden">: {event.title}</span>
          </Link>
          {/* A plain <a download>: the .ics file is a route handler, not a page to navigate to. */}
          <a href={`/events/${event.slug}/calendar.ics`} download className="btn-pill-outline">
            <Icon name="calendar-plus" /> Add to Calendar<span className="visually-hidden">: {event.title}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

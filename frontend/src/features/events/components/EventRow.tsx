import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { dateParts, formatDate, isoDateTime } from "@/lib/dates";
import { formatEventWhen } from "../format";
import { EVENT_CATEGORY_LABELS } from "../schemas";
import type { EventSummary } from "../types";

/** Wide event row used in the /events list view. */
export function EventRow({ event }: { event: EventSummary }) {
  const { day, month } = dateParts(event.startsAt);
  return (
    <article className="event-row">
      <Image
        src={event.image.src}
        alt=""
        width={event.image.width}
        height={event.image.height}
        sizes="(max-width: 767px) 100vw, 240px"
      />
      <div>
        <div className="d-flex gap-3 align-items-center mb-2">
          <time className="date-block" dateTime={isoDateTime(event.startsAt)}>
            <span className="day" aria-hidden="true">
              {day}
            </span>
            <span className="month" aria-hidden="true">
              {month}
            </span>
            <span className="visually-hidden">{formatDate(event.startsAt)}</span>
          </time>
          <div>
            <span className={`ev-badge ${event.category}`}>{EVENT_CATEGORY_LABELS[event.category]}</span>
            <h3 className="mb-0 mt-1">
              <Link href={`/events/${event.slug}`}>{event.title}</Link>
            </h3>
          </div>
        </div>
        <ul className="meta-list list-unstyled">
          <li>
            <Icon name="clock" />
            {formatEventWhen(event.startsAt, event.endsAt)}
          </li>
          <li>
            <Icon name="geo-alt" />
            {event.location}
          </li>
        </ul>
        <p>{event.summary}</p>
        <Link href={`/events/${event.slug}`} className="btn-outline-main">
          View Details<span className="visually-hidden">: {event.title}</span>
        </Link>
      </div>
    </article>
  );
}

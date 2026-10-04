import Link from "next/link";
import { dateParts, isoDateTime } from "@/lib/dates";
import type { EventSummary } from "../types";

/** The green band of upcoming events at the bottom of the home page hero. */
export function EventStrip({ events }: { events: EventSummary[] }) {
  if (events.length === 0) return null;

  return (
    <div className="event-strip">
      <div className="container">
        <h2 className="visually-hidden">Coming up</h2>
        <ul className="row gy-3 list-unstyled mb-0">
          {events.map((event) => {
            const { day, month } = dateParts(event.startsAt);
            return (
              <li className="col-lg-4" key={event.slug}>
                <div className="strip-item">
                  <time className="strip-date" dateTime={isoDateTime(event.startsAt)}>
                    {`${month} ${day}`.toUpperCase()}
                  </time>
                  <span className="strip-title">{event.title}</span>
                  <Link href={`/events/${event.slug}`} className="strip-btn">
                    Details<span className="visually-hidden">: {event.title}</span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

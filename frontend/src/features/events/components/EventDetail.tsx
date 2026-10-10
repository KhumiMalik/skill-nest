import Image from "next/image";
import { ContentBlocks } from "@/components/ui/ContentBlocks";
import { Icon, type IconName } from "@/components/ui/Icon";
import { MiniPostList } from "@/components/ui/MiniPostList";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { dayKey, formatDate, formatTimeRange } from "@/lib/dates";
import { hasPassed } from "../data";
import { MAX_PLACES_PER_BOOKING } from "../schemas";
import type { EventSummary, SchoolEvent } from "../types";
import { EventRegistrationForm } from "./EventRegistrationForm";

/** "This event has finished." The time check is cached for an hour (see hasPassed). */
async function EventFinishedNote({ endsAt }: { endsAt: string }) {
  if (!(await hasPassed(endsAt))) return null;
  return (
    <p className="notice-important">
      <Icon name="info-circle" /> This event has finished.
    </p>
  );
}

/**
 * The booking form while booking is open, otherwise a short note. The deadline check is cached for an
 * hour (see hasPassed); the server action checks it again exactly.
 */
async function BookingPanel({ event, registration }: { event: SchoolEvent; registration: Registration }) {
  if ((await hasPassed(registration.deadline)) || (await hasPassed(event.endsAt))) {
    return <p className="small mt-3 mb-0">Booking for this event has closed.</p>;
  }
  return (
    <div className="booking-panel">
      <h3 className="h5">Book your places</h3>
      <EventRegistrationForm
        slug={event.slug}
        maxPlaces={Math.min(MAX_PLACES_PER_BOOKING, registration.capacity ?? MAX_PLACES_PER_BOOKING)}
      />
    </div>
  );
}

type Registration = NonNullable<SchoolEvent["registration"]>;

type EventDetailProps = {
  event: SchoolEvent;
  /** Upcoming events in the same category, for the sidebar. */
  related: EventSummary[];
};

export function EventDetail({ event, related }: EventDetailProps) {
  const multiDay = dayKey(event.startsAt) !== dayKey(event.endsAt);
  const highlights: { icon: IconName; label: string; value: string }[] = [
    {
      icon: "calendar3",
      label: "Date",
      value: multiDay ? `${formatDate(event.startsAt)} to ${formatDate(event.endsAt)}` : formatDate(event.startsAt),
    },
    { icon: "clock", label: "Time", value: formatTimeRange(event.startsAt, event.endsAt) },
    { icon: "geo-alt", label: "Venue", value: event.address ? `${event.location}, ${event.address}` : event.location },
  ];

  return (
    <div className="row g-4">
      <article className="col-lg-8">
        <div className="article">
          <Image
            src={event.image.src}
            alt={event.image.alt}
            width={event.image.width}
            height={event.image.height}
            sizes="(max-width: 991px) 100vw, 760px"
            className="rounded-img article-cover"
            preload
          />
          <EventFinishedNote endsAt={event.endsAt} />
          <ul className="row g-3 my-3 list-unstyled">
            {highlights.map((item) => (
              <li className="col-md-4" key={item.label}>
                <div className="highlight mb-0">
                  <div className="icon-circle">
                    <Icon name={item.icon} />
                  </div>
                  <div>
                    <h2 className="highlight-label">{item.label}</h2>
                    <p>{item.value}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <h2>About the Event</h2>
          <ContentBlocks blocks={event.description} />

          {event.schedule.length > 0 && (
            <>
              <h2>Event Schedule</h2>
              <ol className="timeline list-unstyled mt-3">
                {event.schedule.map((item) => (
                  <li className="timeline-entry" key={`${item.time}-${item.title}`}>
                    <span className="year">{item.time}</span>
                    <h3>{item.title}</h3>
                    {item.text && <p>{item.text}</p>}
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className="article-footer">
            <div>
              <h2>Add to your calendar</h2>
              <a href={`/events/${event.slug}/calendar.ics`} download className="btn-pill-outline">
                <Icon name="calendar-plus" /> Add to Calendar
              </a>
            </div>
            <div>
              <h2>Share this event</h2>
              <ShareLinks path={`/events/${event.slug}`} title={event.title} />
            </div>
          </div>
        </div>
      </article>

      <aside className="col-lg-4" aria-label="Event information">
        <div className="sidebar-box">
          <h2>Booking</h2>
          <dl className="facts-list">
            <div>
              <dt>Cost</dt>
              <dd>{event.cost}</dd>
            </div>
            {event.registration ? (
              <>
                <div>
                  <dt>Book by</dt>
                  <dd>{formatDate(event.registration.deadline)}</dd>
                </div>
                {event.registration.capacity && (
                  <div>
                    <dt>Places</dt>
                    <dd>{event.registration.capacity}</dd>
                  </div>
                )}
              </>
            ) : (
              <div>
                <dt>Booking</dt>
                <dd>Not needed</dd>
              </div>
            )}
          </dl>
          {event.registration && <BookingPanel event={event} registration={event.registration} />}
        </div>

        <div className="sidebar-box">
          <h2>Event Organiser</h2>
          <p className="mb-1">
            <strong>{event.organizer.name}</strong>
          </p>
          <p className="small mb-2">{event.organizer.role}</p>
          <p className="small mb-0">
            <Icon name="envelope" />{" "}
            <a href={`mailto:${event.organizer.email}`} className="text-break">
              {event.organizer.email}
            </a>
          </p>
        </div>

        {related.length > 0 && (
          <div className="sidebar-box">
            <h2>Related Events</h2>
            <MiniPostList
              posts={related.map((item) => ({
                href: `/events/${item.slug}`,
                title: item.title,
                image: item.image,
                date: item.startsAt,
              }))}
            />
          </div>
        )}
      </aside>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { MiniPostList } from "@/components/ui/MiniPostList";
import { eventsHref } from "../filters";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABELS } from "../schemas";
import type { EventSummary } from "../types";

type EventsSidebarProps = {
  upcoming: EventSummary[];
  featured: EventSummary | null;
};

/** Upcoming events, the featured event and category links. Doesn't depend on the URL, so it is prerendered. */
export function EventsSidebar({ upcoming, featured }: EventsSidebarProps) {
  return (
    <aside aria-label="More events">
      {upcoming.length > 0 && (
        <div className="sidebar-box">
          <h2>Coming Up</h2>
          <MiniPostList
            posts={upcoming.map((event) => ({
              href: `/events/${event.slug}`,
              title: event.title,
              image: event.image,
              date: event.startsAt,
            }))}
          />
        </div>
      )}
      {featured && (
        <div className="sidebar-box">
          <h2>Featured Event</h2>
          <Image
            src={featured.image.src}
            alt={featured.image.alt}
            width={featured.image.width}
            height={featured.image.height}
            sizes="(max-width: 991px) 100vw, 360px"
            className="rounded-img mb-3"
          />
          <h3 className="h6">{featured.title}</h3>
          <p className="small mb-2">{featured.summary}</p>
          <Link href={`/events/${featured.slug}`} className="link-arrow">
            Learn more<span className="visually-hidden">: {featured.title}</span> <Icon name="arrow-right" />
          </Link>
        </div>
      )}
      <div className="sidebar-box">
        <h2>Event Categories</h2>
        <ul className="plain">
          {EVENT_CATEGORIES.map((category) => (
            <li key={category}>
              <Link href={eventsHref({ category })}>{EVENT_CATEGORY_LABELS[category]}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

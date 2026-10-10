import { getEvent, getEvents } from "@/features/events";
import { formatDate, formatTimeRange } from "@/lib/dates";
import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/seo/og-image";

// Share image for an event: its title, date, time and venue.
export const alt = "Greenfield Academy event";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

/** Same events as the page prerenders, so their images are generated at build time too. */
export async function generateStaticParams() {
  const { data } = await getEvents({ pageSize: 50 });
  return data.map((event) => ({ slug: event.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug);
  if (!event) return renderOgImage({ eyebrow: "Events", title: "Events at Greenfield Academy" });
  return renderOgImage({
    eyebrow: "Event",
    title: event.title,
    detail: `${formatDate(event.startsAt)} · ${formatTimeRange(event.startsAt, event.endsAt)} · ${event.location}`,
  });
}

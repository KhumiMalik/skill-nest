import { connection } from "next/server";
import { siteConfig } from "@/config/site";
import { buildIcs, getEvent } from "@/features/events";

/** GET /events/{slug}/calendar.ics: the event as an iCalendar file ("Add to Calendar"). */
export async function GET(_request: Request, { params }: RouteContext<"/events/[slug]/calendar.ics">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return new Response("Event not found", { status: 404 });

  // The file's timestamp (DTSTAMP) is "now", so build it at request time.
  await connection();
  const ics = buildIcs(event, { siteUrl: siteConfig.url, now: new Date() });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}

import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/metadata";
import { type JsonLd, postalAddressJsonLd, schoolReference } from "@/lib/seo/json-ld";
import type { SchoolEvent } from "./types";

/**
 * schema.org Event for an event page. Venues on the school site get the school's address;
 * off-site venues have their own `address` from the API.
 */
export function eventJsonLd(event: SchoolEvent): JsonLd {
  const url = absoluteUrl(`/events/${event.slug}`);
  return {
    "@type": "Event",
    name: event.title,
    description: event.summary,
    url,
    image: [event.image.src],
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location,
      address: event.address ?? postalAddressJsonLd(),
    },
    organizer: schoolReference(),
    // Costs are free text ("£8 adults, £4 pupils"); only "Free" can be expressed as a price reliably.
    ...(event.cost === "Free" && {
      offers: { "@type": "Offer", price: 0, priceCurrency: siteConfig.currency, url },
    }),
  };
}

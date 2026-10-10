import { describe, expect, it } from "vitest";
import { eventJsonLd } from "@/features/events/structured-data";
import type { SchoolEvent } from "@/features/events/types";
import { breadcrumbJsonLd, serializeJsonLd } from "./json-ld";
import { absoluteUrl, pageMetadata } from "./metadata";

describe("pageMetadata", () => {
  it("sets the canonical URL and Open Graph fields from the page's path", () => {
    const metadata = pageMetadata({ title: "News", description: "Latest news.", path: "/news" });
    expect(metadata.alternates).toEqual({ canonical: "/news" });
    expect(metadata.openGraph).toMatchObject({
      title: "News",
      description: "Latest news.",
      url: "/news",
      siteName: "Greenfield Academy",
      type: "website",
      images: [expect.objectContaining({ url: "/opengraph-image" })],
    });
  });

  it("leaves the image out for routes with their own opengraph-image file", () => {
    const metadata = pageMetadata({
      title: "Sports Day",
      description: "...",
      path: "/news/sports-day",
      ownImage: true,
    });
    expect(metadata.openGraph).not.toHaveProperty("images");
  });
});

describe("JSON-LD", () => {
  it("escapes < so content can't close the script tag", () => {
    const json = serializeJsonLd({ "@type": "Thing", name: "</script><script>alert(1)</script>" });
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json)).toMatchObject({
      "@context": "https://schema.org",
      name: "</script><script>alert(1)</script>",
    });
  });

  it("builds breadcrumbs with absolute URLs, the current page unlinked", () => {
    expect(
      breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: "Sports Day" }]),
    ).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "News", item: absoluteUrl("/news") },
        { "@type": "ListItem", position: 3, name: "Sports Day" },
      ],
    });
  });

  const event: SchoolEvent = {
    slug: "carol-service-2026",
    title: "Carol Service",
    summary: "Readings and carols.",
    category: "arts",
    startsAt: "2026-12-16T18:00:00Z",
    endsAt: "2026-12-16T19:30:00Z",
    location: "Main Hall",
    image: { src: "https://placehold.co/800x500/png", alt: "", width: 800, height: 500 },
    featured: false,
    description: [{ type: "paragraph", text: "Details." }],
    schedule: [],
    organizer: { name: "Ms Grant", role: "Director of Music", email: "music@example.com" },
    cost: "Free",
    registration: null,
  };

  it("gives on-site events the school's address and off-site events their own", () => {
    expect(eventJsonLd(event).location).toMatchObject({
      name: "Main Hall",
      address: { "@type": "PostalAddress", streetAddress: "42 Meadow Lane", addressCountry: "GB" },
    });
    expect(eventJsonLd({ ...event, location: "St Mary's Church", address: "Church Street" }).location).toMatchObject({
      address: "Church Street",
    });
  });

  it("only adds a price for free events", () => {
    expect(eventJsonLd(event).offers).toMatchObject({ price: 0, priceCurrency: "GBP" });
    expect(eventJsonLd({ ...event, cost: "£8 adults" })).not.toHaveProperty("offers");
  });
});

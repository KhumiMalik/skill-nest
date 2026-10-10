import { siteConfig } from "@/config/site";
import { absoluteUrl } from "./metadata";

// Structured data (https://schema.org) rendered as <script type="application/ld+json">.
// It helps search engines show rich results: breadcrumbs, events, articles, job postings.

export type JsonLd = { "@context"?: "https://schema.org"; "@type": string } & Record<string, unknown>;

/**
 * JSON for a <script> tag. "<" is escaped so content can never close the tag early
 * ("</script>" in a title would otherwise end the script and inject HTML).
 */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
}

/** Stable id of the school, so other objects (articles, events) can point at it. */
export const SCHOOL_ID = absoluteUrl("/#school");

export function postalAddressJsonLd() {
  const { street, locality, postalCode, country } = siteConfig.contact.address;
  return {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: locality,
    postalCode,
    addressCountry: country,
  };
}

/** The school itself, on the home page. */
export function schoolJsonLd(): JsonLd {
  const { contact, social } = siteConfig;
  return {
    "@type": "School",
    "@id": SCHOOL_ID,
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/apple-icon"),
    foundingDate: String(siteConfig.foundedYear),
    telephone: contact.phone,
    email: contact.email,
    address: postalAddressJsonLd(),
    sameAs: social.map((profile) => profile.href),
  };
}

/** A short reference to the school, for `publisher`, `organizer`, `hiringOrganization`... */
export function schoolReference() {
  return { "@type": "School", "@id": SCHOOL_ID, name: siteConfig.name, url: absoluteUrl("/") };
}

/** Breadcrumb trail. The last item is the current page and may have no link. */
export function breadcrumbJsonLd(items: { label: string; href?: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: absoluteUrl(item.href) }),
    })),
  };
}

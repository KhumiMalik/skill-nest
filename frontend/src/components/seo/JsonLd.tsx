import { type JsonLd as JsonLdData, serializeJsonLd } from "@/lib/seo/json-ld";

/**
 * Structured data for search engines. A plain <script> (not next/script): it is data, not code,
 * so the browser never runs it and the CSP doesn't apply to it.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  // serializeJsonLd escapes "<", so the content can't break out of the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}

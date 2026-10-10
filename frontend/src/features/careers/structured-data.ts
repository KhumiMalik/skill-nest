import { contentBlocksToText } from "@/components/ui/ContentBlocks";
import { absoluteUrl } from "@/lib/seo/metadata";
import { type JsonLd, postalAddressJsonLd, schoolReference } from "@/lib/seo/json-ld";
import type { Vacancy } from "./types";

/**
 * schema.org JobPosting for an open vacancy (job search engines list these). Only rendered while
 * the vacancy is open: an expired JobPosting should be removed, not left on the page.
 */
export function jobPostingJsonLd(vacancy: Vacancy): JsonLd {
  const employmentType = [vacancy.pattern === "full-time" ? "FULL_TIME" : "PART_TIME"];
  if (vacancy.contract === "fixed-term") employmentType.push("TEMPORARY");

  const description = [
    vacancy.summary,
    contentBlocksToText(vacancy.description),
    vacancy.responsibilities.length > 0 && `Main responsibilities:\n${vacancy.responsibilities.join("\n")}`,
    vacancy.requirements.length > 0 && `What we are looking for:\n${vacancy.requirements.join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    "@type": "JobPosting",
    title: vacancy.title,
    description,
    datePosted: vacancy.postedAt,
    validThrough: vacancy.closesAt,
    employmentType,
    hiringOrganization: { ...schoolReference(), logo: absoluteUrl("/apple-icon") },
    jobLocation: { "@type": "Place", address: postalAddressJsonLd() },
    url: absoluteUrl(`/careers/${vacancy.slug}`),
    directApply: false,
  };
}

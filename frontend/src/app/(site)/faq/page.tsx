import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { FaqDirectory, faqPageJsonLd, getFaqs } from "@/features/faq";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about admissions, fees and bursaries, the school day, uniform, transport and pastoral care at Greenfield Academy.",
  path: "/faq",
});

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <PageBanner
        title="Frequently Asked Questions"
        description="Quick answers about admissions, fees, the school day and more."
        breadcrumbs={[{ label: "FAQ" }]}
      />
      <FaqDirectory faqs={faqs} />
    </>
  );
}

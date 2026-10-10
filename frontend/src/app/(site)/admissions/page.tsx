import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { AdmissionEnquiryForm } from "@/features/admissions";
import { FaqSection, getFaqs } from "@/features/faq";
import { AdmissionsContact, AdmissionsOverview, FeesSection, getAdmissionsPage } from "@/features/page-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Admissions",
  description:
    "How to apply to Greenfield Academy: the admission process, entry requirements, key dates, fees, bursaries and application forms.",
  path: "/admissions",
});

export default async function AdmissionsPage() {
  const [page, faqs] = await Promise.all([getAdmissionsPage(), getFaqs("admissions")]);

  return (
    <>
      <PageBanner title="Admissions" description="Everything you need to know about joining Greenfield Academy." />
      <AdmissionsOverview page={page} />
      <FeesSection fees={page.fees} documents={page.documents} />
      <FaqSection
        title="Admissions Questions"
        subtitle="Answers to the questions families ask us most often."
        faqs={faqs}
      />
      <AdmissionsContact visit={page.visit} apply={page.apply} form={<AdmissionEnquiryForm />} />
    </>
  );
}

import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { getLegalPage, LegalContent } from "@/features/page-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that apply when you use the Greenfield Academy website.",
  path: "/terms",
});

export default async function TermsPage() {
  const page = await getLegalPage("terms");

  return (
    <>
      <PageBanner title="Terms of Service" description={page.summary} />
      <LegalContent page={page} />
    </>
  );
}

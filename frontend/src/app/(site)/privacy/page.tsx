import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/PageBanner";
import { getLegalPage, LegalContent } from "@/features/page-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Greenfield Academy collects, uses and protects personal information.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const page = await getLegalPage("privacy");

  return (
    <>
      <PageBanner title="Privacy Policy" description={page.summary} />
      <LegalContent page={page} />
    </>
  );
}

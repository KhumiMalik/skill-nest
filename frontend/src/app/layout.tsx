import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { baseOpenGraph, DEFAULT_OG_IMAGE } from "@/lib/seo/metadata";
import { fontVariables } from "./fonts";
import "@/styles/main.scss";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // Defaults for pages without their own (pages use pageMetadata() from lib/seo/metadata.ts).
  openGraph: {
    ...baseOpenGraph,
    images: [DEFAULT_OG_IMAGE],
    title: siteConfig.name,
    description: siteConfig.description,
  },
  // Large preview cards on X; it reads the Open Graph title, description and image.
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0c7f56",
};

/** Root layout: document, fonts and global styles only. Page chrome lives in (site)/layout.tsx. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}

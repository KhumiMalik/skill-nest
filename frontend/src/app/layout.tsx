import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontVariables } from "./fonts";
import "@/styles/main.scss";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
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

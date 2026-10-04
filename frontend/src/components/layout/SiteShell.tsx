import type { ReactNode } from "react";
import { mainNav, siteConfig } from "@/config/site";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { RevealOnScroll } from "./RevealOnScroll";
import { ScrollTop } from "./ScrollTop";

/** Skip link, header, main landmark and footer shared by all public pages and the 404 page. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header siteName={siteConfig.name} nav={mainNav} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <ScrollTop />
      <RevealOnScroll />
    </>
  );
}

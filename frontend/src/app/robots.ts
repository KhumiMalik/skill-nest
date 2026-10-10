import type { MetadataRoute } from "next";
import { serverEnv } from "@/config/env";
import { absoluteUrl } from "@/lib/seo/metadata";

/**
 * /robots.txt. Set ALLOW_INDEXING=false on staging and preview deployments so search engines
 * don't index a copy of the site.
 */
export default function robots(): MetadataRoute.Robots {
  if (!serverEnv.ALLOW_INDEXING) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

import { siteConfig } from "@/config/site";
import { OG_IMAGE_SIZE, renderOgImage } from "@/lib/seo/og-image";

// The default share image for every page that has no image of its own.
// Generated once at build time (it reads no request data).
export const alt = `${siteConfig.name}: an independent day school for ages 3 to 18`;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    title: "Where curious minds grow into confident young people",
    detail: "Ages 3 to 18 · Founded 1974",
  });
}

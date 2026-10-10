import { renderLogoIcon } from "@/lib/seo/og-image";

// Favicon, generated at build time from the logo icon (replaces the default favicon.ico).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return renderLogoIcon(size.width);
}

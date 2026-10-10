import { renderLogoIcon } from "@/lib/seo/og-image";

// Home-screen icon for iOS, and the logo used in structured data (/apple-icon).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderLogoIcon(size.width);
}

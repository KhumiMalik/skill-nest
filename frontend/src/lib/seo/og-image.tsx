import { ImageResponse } from "next/og";
import { ICONS } from "@/components/ui/icons.generated";
import { siteConfig } from "@/config/site";

/** Share image size recommended by Facebook, LinkedIn and X (1.91:1). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/** The logo icon as an <img> source: ImageResponse (Satori) draws SVG images but not inline SVG markup strings. */
const logo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#ffffff">${ICONS.buildings}</svg>`,
)}`;

type OgImageOptions = {
  /** Small line above the title, e.g. "News" or "Event". */
  eyebrow?: string;
  title: string;
  /** Line under the title, e.g. a date and place. */
  detail?: string;
};

/**
 * A branded share card: the school name, a title and an optional detail line on the brand green.
 * ImageResponse renders a small subset of HTML/CSS (flexbox only, inline styles) to a PNG.
 * It uses its built-in sans-serif font, so no font files need to ship with the site.
 */
export function renderOgImage({ eyebrow, title, detail }: OgImageOptions): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "linear-gradient(135deg, #0c7f56 0%, #095f41 100%)",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 38, fontWeight: 700 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain <img> */}
        <img src={logo} width={56} height={56} alt="" />
        {siteConfig.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {eyebrow && (
          <div style={{ fontSize: 30, textTransform: "uppercase", letterSpacing: 4, color: "#b9f0d8" }}>{eyebrow}</div>
        )}
        <div style={{ fontSize: title.length > 60 ? 56 : 68, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        {detail && <div style={{ fontSize: 32, color: "#e3f6ee" }}>{detail}</div>}
      </div>
    </div>,
    OG_IMAGE_SIZE,
  );
}

/** The logo on a brand-green rounded square, for the favicon and the Apple touch icon. */
export function renderLogoIcon(size: number): ImageResponse {
  const padding = Math.round(size * 0.18);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0c7f56",
        borderRadius: Math.round(size * 0.2),
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain <img> */}
      <img src={logo} width={size - padding * 2} height={size - padding * 2} alt="" />
    </div>,
    { width: size, height: size },
  );
}

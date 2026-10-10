import { Dancing_Script, Poppins, Raleway, Roboto } from "next/font/google";

// next/font downloads the fonts at build time and serves them from our own origin,
// so there are no requests to Google at runtime (and the CSP can stay `font-src 'self'`).
//
// No font is preloaded. With `display: swap` text appears straight away in a fallback font sized to
// match (next/font adjusts it), so the web fonts aren't needed for the first paint. Preloading them
// made ~100 KB of fonts compete with the CSS on slow mobile connections.

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  preload: false,
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
  preload: false,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-dancing-script",
  display: "swap",
  preload: false, // only used for one decorative signature
});

export const fontVariables = [roboto, raleway, poppins, dancingScript].map((f) => f.variable).join(" ");

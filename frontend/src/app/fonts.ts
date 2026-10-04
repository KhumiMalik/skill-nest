import { Dancing_Script, Poppins, Raleway, Roboto } from "next/font/google";

// next/font downloads the fonts at build time and serves them from our own origin,
// so there are no requests to Google at runtime (and the CSP can stay `font-src 'self'`).

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-poppins",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-dancing-script",
  display: "swap",
  preload: false, // only used for one decorative signature
});

export const fontVariables = [roboto, raleway, poppins, dancingScript].map((f) => f.variable).join(" ");
